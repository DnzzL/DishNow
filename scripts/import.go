// https://gist.github.com/trevorstarick/31defb0c288735669530c684855d61b1
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	_ "modernc.org/sqlite"
)

func main() {
	if len(os.Args) < 2 {
		panic("no db file provided")
	}

	for _, file := range os.Args[2:] {
		tableName := strings.TrimSuffix(file, filepath.Ext(file))
		tableName = filepath.Base(tableName)

		importStmt := fmt.Sprintf(".import --skip 1 %v %v", file, tableName)
		cmd := exec.Command("sqlite3", "-csv", os.Args[1], importStmt)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			panic(err)
		}
	}
}