export const loginAdmin = async (data: any) => {
  return new Promise((resolve, reject) => {

    setTimeout(() => {

      if (
        data.correo === "admin@admin.com" &&
        data.password === "1234"
      ) {
        resolve({
          ok: true,
          token: "fake-jwt-token",
          user: {
            rol: "ADMIN",
            nombre: "Administrador"
          }
        });
      } else {
        reject({
          ok: false,
          message: "Credenciales incorrectas"
        });
      }

    }, 1000); // simula delay del backend

  });
};