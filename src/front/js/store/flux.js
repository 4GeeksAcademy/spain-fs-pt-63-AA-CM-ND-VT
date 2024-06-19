
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			username: null,
			user_id: null,
			rol: null,
			image: null
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
					setStore({ username: data.username });
					setStore({ user_id: data.user_id });
					setStore({ rol: data.rol })
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

			signupCompany: async (email, password, name, rol, companyName, location) => {
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
						company_name: companyName,
						location: location
					}),
				};
				console.log(opts);
				try {
					const resp = await fetch(
						`${process.env.BACKEND_URL}/api/signup_company`,
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
				const token = localStorage.getItem("token");
				const user_id = localStorage.getItem("user_id");
				const username = localStorage.getItem("username");
				const rol = localStorage.getItem("rol");

				if (token) {
					setStore({
						...store,
						token: token,
						user_id: user_id,
						username: username,
						rol: rol
					});
				}
			},

			logout: async () => {
				const opts = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + getStore().token
					}
				};
				try {
					await fetch(`${process.env.BACKEND_URL}/api/logout`, opts);
					sessionStorage.removeItem("token");
					setStore({ token: null, username: null, user_id: null, rol: null });
				} catch (error) {
					console.log(error);
				}
			},

			uploadWorkImage: async (imgId) => {
				const store = getStore();
				const image = imgId
				setStore({ ...store, image: image })
			}
		},
    deleteServices: async (Id) => {
	const store = getStore();
	const opts = {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + store.token
		}
	};
	try {
		const resp = await fetch(`${process.env.BACKEND_URL}/api/services/${Id}`, opts);
		if (resp.status !== 200) {
			alert("There has been some error");
			return false;
		}
		return true;
				} catch (error) {
					console.log(error);
					return false;
				}
	}

	
};

   
}	
export default getState;
