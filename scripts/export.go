// https://gist.github.com/trevorstarick/664d4a40c0246eced6b178890d073096
package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"sort"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/security"
	"github.com/pocketbase/pocketbase/tools/types"
	_ "modernc.org/sqlite"
)

// map existing column to Pocketbase column `"created_at": "created"`
var headerMapping = map[string]string{}

// list of table names you want to export
var tables = []string{}

func RandomID() string {
	return security.RandomStringWithAlphabet(models.DefaultIdLength, models.DefaultIdAlphabet)
}

func removeDuplicateStr(strSlice []string) []string {
	hashmap := make(map[string]struct{})
	list := []string{}

	for _, item := range strSlice {
		if _, ok := hashmap[item]; !ok {
			hashmap[item] = struct{}{}
			list = append(list, item)
		}
	}

	return list
}

func process(arg string) {
	println(arg)

	db, err := sqlx.Open("sqlite", arg)
	if err != nil {
		panic(err)
	}

	for _, table := range tables {
		query := "SELECT * FROM " + table

		rows, err := db.Queryx(query)
		if err != nil {
			panic(err)
		}

		headers, err := rows.Columns()
		if err != nil {
			panic(err)
		}

		headers = append(headers, "id", "created", "updated")

		for i, header := range headers {
			if mapped, ok := headerMapping[header]; ok {
				headers[i] = mapped
			}
		}

		headers = removeDuplicateStr(headers)
		sort.Strings(headers)

		var (
			d   map[string]any
			row = make([]string, 0, 1+len(headers))
			fn  = strings.TrimSuffix(arg, filepath.Ext(arg))
		)

		err = os.Mkdir(fn, 0o755)
		if err != nil && !os.IsExist(err) {
			panic(err)
		}

		f, err := os.OpenFile(fn+"/"+table+".csv", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
		if err != nil {
			panic(err)
		}

		writer := csv.NewWriter(f)

		err = writer.Write(headers)
		if err != nil {
			panic(err)
		}

		for rows.Next() {
			d = make(map[string]any)
			row = row[:0]

			err := rows.MapScan(d)
			if err != nil {
				panic(err)
			}

			for k, v := range d {
				if header, ok := headerMapping[k]; ok {
					d[header] = v
					delete(d, k)
				}
			}

			if d["id"] == nil || d["id"] == "" {
				d["id"] = RandomID()
			}

			if d["created"] == nil {
				d["created"] = time.Now().Format(types.DefaultDateLayout)
			}

			if d["updated"] == nil {
				d["updated"] = d["created"]
			}

			for _, header := range headers {
				value, ok := d[header]
				if !ok {
					panic("missing header: " + header)
				}

				switch v := value.(type) {
				case int64:
					if header == "created" || header == "updated" || header == "added" {
						date := time.Unix(v, 0).Format(types.DefaultDateLayout)
						row = append(row, date)
					} else {
						row = append(row, fmt.Sprintf("%d", v))
					}
				case float64, float32:
					row = append(row, fmt.Sprintf("%f", v))
				case string:
					row = append(row, v)
				case []byte:
					row = append(row, string(v))
				default:
					fmt.Println(header, reflect.TypeOf(v), reflect.TypeOf(v).Kind())

					b, err := json.Marshal(v)
					if err != nil {
						panic(err)
					}

					row = append(row, string(b))
				}
			}

			err = writer.Write(row)
			if err != nil {
				panic(err)
			}
		}

		writer.Flush()
	}
}

func main() {
	for _, arg := range os.Args[1:] {
		process(arg)
	}
}