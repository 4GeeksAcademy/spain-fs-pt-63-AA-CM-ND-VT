const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      // Define your store here
    },
    actions: {
      signup: async (email, password, name, rol) => {
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            rol: rol,
          }),
        };
        console.log(opts);
        try {
          const resp = await fetch(
            `${process.env.BACKEND_URL}/api/signin`,
            opts
          );
          console.log(resp);
          if (resp.status !== 201) {
            alert("There has been some error");
            return false;
          }
          const data = await resp.json();
          alert("Signup successful");
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    },
  };
};

export default getState;
