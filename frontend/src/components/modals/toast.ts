/* eslint-disable @typescript-eslint/no-explicit-any */
let toast: any;

// Function to initialize and retrieve the toast instance
const getToastInstance = async () => {
  if (!toast && typeof window !== "undefined") {
    const Swal = (await import("sweetalert2")).default;
    toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }
  return toast;
};

export default getToastInstance;