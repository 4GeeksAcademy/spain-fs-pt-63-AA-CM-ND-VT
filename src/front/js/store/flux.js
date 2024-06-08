const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
            message: null
		},
		actions: {
			login: async (email, password) => {
                const opts = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "email": email,
                        "password": password
                    })
                }
                try {
                    const resp = await fetch(
						`${process.env.BACKEND_URL}/api/login`,
						opts
					);
                    if (resp.status !== 200) {
                        alert("There has been some error");
                        return false;
                    }
                    const data = await resp.json();
                    sessionStorage.setItem("token", data.access_token);
                    setStore({ token: data.access_token });
                    return true;

                } catch (error) {
                    console.log(error);
                }
            },

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
					alert(data.msg);
					return true;
				} catch (error) {
					console.log(error);
					return false;
				}
			},

			syncToken: () => {
                const token = sessionStorage.getItem("token");
                if (token && token !== "" && token !== undefined) setStore({ token: token });
            },
		},
	};
};

export default getState;
