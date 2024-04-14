import { emailRegexValidate } from "./regex";

export const trimAndValidate = (name, value) => {
  let newError = "";
  let trimmedValue;

  switch (name) {
    case "name":
      trimmedValue = value.trim();
      if (!trimmedValue) {
        newError = "Name is required";
      }
      break;
    case "email":
      trimmedValue = value.trim();
      if (!trimmedValue) {
        newError = "Email is required";
      } else if (!emailRegexValidate(trimmedValue)) {
        newError = "Please enter a valid email address";
      }
      break;

    case "address":
      trimmedValue = value.trimStart()
      if (!trimmedValue) {
        newError = "Location is required";
      }
      break;

    default:
      trimmedValue = value.trim();
  }

  return { value: trimmedValue, error: newError };
};
