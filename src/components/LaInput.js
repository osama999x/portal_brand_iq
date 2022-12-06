import React from "react";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";

function LaInput({
  onChange,
  values,
  isFormFieldValid,
  getFormErrorMessage,
  keyName,
  placeholder,
}) {
  return (
    <>
      <InputText
        id={keyName}
        placeholder={placeholder}
        name={keyName}
        value={values[keyName]}
        onChange={onChange}
        className={classNames({
          "p-invalid": isFormFieldValid(keyName.toString()),
        })}
      />
      {getFormErrorMessage(keyName.toString())}
    </>
  );
}

export default LaInput;
// Usage: 
// const props = {
//     isFormFieldValid,
//     getFormErrorMessage,
//     onChange,
//     values,
//   };
// <LaInput keyName="firstname" placeholder="First Name" {...props} />