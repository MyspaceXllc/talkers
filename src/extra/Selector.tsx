import React, { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Selector(props: any) {
  const {
    label,
    placeholder,
    selectValue,
    setSelectValue,
    paginationOption,
    id,
    labelShow,
    selectData,
    onChange,
    defaultValue,
    errorMessage,
    selectId,
  } = props;

  return (
    <div className="selector-custom">
      {labelShow === false ? (
        " "
      ) : (
        <label htmlFor={id} className="label-selector-custom">
          {label}
        </label>
      )}

      <div style={{ minWidth: 120 }} className="form-group">
        <div className="form-outline w-100">
          {/* <label className="form-label" htmlFor="formControlLg" id="demo-simple-select-label">{label}</label> */}
          <select
            id="formControlLg"
            className=" form-select py-2 text-capitalize"
            aria-label={label}
            value={selectValue ? selectValue : ""}
            aria-placeholder={placeholder}
            defaultValue={defaultValue ? defaultValue : ""}
            onChange={onChange}
            style={{ borderRadius: "30px", maxHeight: "200px" }}
          >
            {paginationOption === false ? (
              ""
            ) : (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {selectData?.map((item: any, index: number) => {
              const displayValue = selectId
                ? (item as { _id: string; name: string; fullName?: string })
                    .fullName ||
                  (item as { _id: string; name: string; fullName?: string })
                    .name
                : typeof item === "string"
                ? item.toLowerCase()
                : item;
              return (
                <option
                  value={
                    selectId
                      ? (item as { _id: string })._id
                      : typeof item === "string"
                      ? item.toLowerCase()
                      : item
                  }
                  key={index}
                  className="py-2"
                >
                  {displayValue}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {errorMessage && (
        <p className="errorMessage">{errorMessage && errorMessage}</p>
      )}
    </div>
  );
}
