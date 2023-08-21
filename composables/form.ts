export function useForm() {
  function castAsFormData(data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) return;
      if (typeof value === "object" && value !== null) {
        for (const elem of value) {
          formData.append(key, elem);
        }
      } else {
        formData.append(key, value);
      }
    });

    return formData;
  }

  return {
    castAsFormData,
  };
}
