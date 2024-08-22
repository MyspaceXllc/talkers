"use client";
import Image from "next/image";

export default function Button(props: any) {
  const {
    newClass,
    btnColor,
    btnName,
    onClick,
    style,
    btnIcon,
    disabled,
    type,
  } = props;

  return (
    <>
      <button
        className={`themeBtn text-center ${newClass || ""} ${btnColor || ""}`}
        onClick={onClick}
        style={style}
        disabled={disabled}
        type={type}
      >
        {btnIcon ? (
          <>
            {btnIcon}
            <span className="">{btnName}</span>
          </>
        ) : (
          btnName
        )}
      </button>
    </>
  );
};
