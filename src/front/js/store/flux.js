
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			username: null,
			user_id: null,
			rol: null,
			image: null,
			companyname: null,
			company_id: null,
			services: [],
			masterServices: [],
		},
		actions: {

			// ---- apartado sesiones

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
					setStore({ companyname: data.companyname });
					setStore({ company_id: data.company_id });
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
					setStore({
						token: null, username: null, user_id: null, rol: null, companyname: null,
						company_id: null
					});
				} catch (error) {
					console.log(error);
				}
			},

			// ---- apartado imagenes

			uploadWorkImage: async (imgId) => {
				const store = getStore();
				const image = imgId
				setStore({ ...store, image: image })
			},

			// ---- apartado servicios

			getServicesByCompany: async (companyId) => {
				console.log(companyId);
				const store = getStore();
				const opts = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${store.token}`
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/services?companies_id=${companyId}`, opts);
					if (resp.status !== 200) {
						alert("There has been some error");
						return [];
					}
					const data = await resp.json();
					return data;
				} catch (error) {
					console.log(error);
					return [];
				}
			},			

			getAllServices: async () => {
				const store = getStore();
				const opts = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${store.token}`
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/all_services`, opts);
					if (resp.status !== 200) {
						alert("There has been some error");
						return [];
					}
					const data = await resp.json();
					return data;
				} catch (error) {
					console.log(error);
					return [];
				}
			},					

			createService: async (serviceData) => {
				const store = getStore();
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${store.token}`
					},
					body: JSON.stringify(serviceData),
				};
				try {
					const resp = await fetch(
						`${process.env.BACKEND_URL}/api/services`,
						opts
					);
					if (resp.status !== 201) {
						alert("There has been some error");
						return false;
					}
					const data = await resp.json();
					alert("Service created successfully");
					return true;
				} catch (error) {
					console.log(error);
					return false;
				}
			},

			getMasterServices: async () => {
				const store = getStore();
				const opts = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${store.token}`
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/master_services`, opts);
					if (resp.status !== 200) {
						alert("There has been some error");
						return [];
					}
					const data = await resp.json();
					return data;
				} catch (error) {
					console.log(error);
					return [];
				}
			}
		},
	};
};

export default getState;
