import Swal from "sweetalert2";

export const showSuccess = (title: string) => {
  Swal.fire({ icon: "success", title, timer: 3000, showConfirmButton: true });
};

export const showError = (title: string) => {
  Swal.fire({ icon: "error", title, timer: 3000, showConfirmButton: true });
}