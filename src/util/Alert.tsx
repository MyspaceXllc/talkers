import swal from "sweetalert";

export const alert = (title: string, data: string, type: string) => {
  return swal(title, data, type);
};

export const warning : any = (buttons : boolean): Promise<boolean> => {
  return swal({
    title: "Are You Sure!",
    icon: "warning",
    dangerMode: true,
    buttons: buttons ? ["Cancel", "Confirm"] : [false],
  });
};

// Delete Warning for category
export const warningForText = (text: string): Promise<boolean> => {
  return swal({
    title: "Are You Sure!",
    text: text,
    icon: "warning",
    dangerMode: true,
    // buttons: true,
  });
};

