
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			username: null,
			user_id: null,
			rol: null,
			companyname: null,
			company:null,
			company_id: null,
			services: [],
			masterServices: [],
			image: null,
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
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, opts);
					if (resp.status !== 200) {
						alert("There has been some error");
						return false;
					}
					const data = await resp.json();
					sessionStorage.setItem("token", data.access_token);
					sessionStorage.setItem("username", data.username);
					sessionStorage.setItem("user_id", data.user_id);
					sessionStorage.setItem("rol", data.rol);
					sessionStorage.setItem("companyname", data.companyname);
					sessionStorage.setItem("company_id", data.company_id);
					setStore({
						token: data.access_token,
						username: data.username,
						user_id: data.user_id,
						rol: data.rol,
						companyname: data.companyname,
						company_id: data.company_id
					});
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
				try {
					const resp = await fetch(
						`${process.env.BACKEND_URL}/api/signin`,
						opts
					);
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
				try {
					const resp = await fetch(
						`${process.env.BACKEND_URL}/api/signup_company`,
						opts
					);
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
				const user_id = sessionStorage.getItem("user_id");
				const username = sessionStorage.getItem("username");
				const rol = sessionStorage.getItem("rol");

				if (token) {
					setStore({
						...getStore(),
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
					sessionStorage.removeItem("user_id");
					sessionStorage.removeItem("username");
					sessionStorage.removeItem("rol");
					setStore({
						token: null,
						username: null,
						user_id: null,
						rol: null,
						companyname: null,
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
					console.log(data);
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
			},

			reserveService: async (reservationData) => {
				const store = getStore();
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${store.token}`
					},
					body: JSON.stringify(reservationData),
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/bookings`, opts);
					if (resp.status !== 201) {
						alert("There has been some error");
						return false;
					}
					const data = await resp.json();
					const dataRequest = {
						booking_id: data.id,
						status: "Pendiente",
						comment: ""
					};

					const optsRequest = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						},
						body: JSON.stringify(dataRequest),
					};

					try {
						const respRequest = await fetch(`${process.env.BACKEND_URL}/api/requests`, optsRequest);
						if (respRequest.status !== 201) {
							alert("There has been some error");
							return false;
						}
						alert("Service reserved successfully");
					} catch (error) {
						console.log(error);
						return false;
					}
				} catch (e) {
					console.log(e);
				}
			},


			getUser: async (user_id) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/clientportal/${user_id}`, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					});
					if (!resp.ok) {
						throw new Error('Failed to fetch company');
					}
					const data = await resp.json();
					setStore({ user: data });
					return data;
				} catch (error) {
					console.error('Error fetching company:', error);
					throw error;
				}
			},

			updateUser: async (user_id, userData) => {
				const store = getStore();
				const token = store.token;

				console.log(`Updating user ${user_id} with data:`, userData);
				console.log('Backend URL:', process.env.BACKEND_URL);
				console.log('Token:', token);

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/clientportal/${user_id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(userData)
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error('Error:', errorData);
						throw new Error('Failed to update user');
					}

					const data = await response.json();
					console.log('User updated successfully:', data);
					return data;
				} catch (error) {
					console.error('Fetch error:', error);
					throw error;
				}
			},


			deleteUser: async (user_id) => {
				const store = getStore();
				const token = store.token;

				console.log(`Deleting user ${user_id}`);
				console.log('Backend URL:', process.env.BACKEND_URL);
				console.log('Token:', token);

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/clientportal/${user_id}`, {
						method: 'DELETE',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error('Error:', errorData);
						alert('Error deleting user');
						return false;
					}

					console.log('User deleted successfully');
					setStore({ user: null });
					return true;
				} catch (error) {
					console.error('Fetch error:', error);
					return false;
				}
			},

			// ---- Tema reservas user

			getUserBookings: async () => {
				const userId = sessionStorage.getItem('user_id');
				if (!userId) {
					alert("User ID is missing. Please log in again.");
					return [];
				}
				const opts = {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user_bookings?user_id=${userId}`, opts);
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

			getUserRequests: async () => {
				const userId = sessionStorage.getItem('user_id');
				if (!userId) {
					alert("User ID is missing. Please log in again.");
					return [];
				}
				const opts = {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user_requests?user_id=${userId}`, opts);
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

			// ---- Company functions

			getCompanyBookings: async () => {
				const companyId = sessionStorage.getItem('company_id');
				if (!companyId) {
					alert("Company ID is missing. Please log in again.");
					return [];
				}
				const opts = {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/company_bookings?company_id=${companyId}`, opts);
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

			getCompanyRequests: async () => {
				const companyId = sessionStorage.getItem('company_id');
				if (!companyId) {
					alert("Company ID is missing. Please log in again.");
					return [];
				}
				const opts = {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/company_requests?company_id=${companyId}`, opts);
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

			updateRequestStatus: async (requestId, status, comment) => {
				const companyId = sessionStorage.getItem('company_id');
				if (!companyId) {
					alert("Company ID is missing. Please log in again.");
					return null;
				}
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ requestId, status, comment })
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/update_request`, opts);
					if (resp.status !== 200) {
						alert("There has been some error");
						return null;
					}
					const data = await resp.json();
					return data;
				} catch (error) {
					console.log(error);
					return null;
				}
			},

			getCompany: async (company_id) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/adminportal/${company_id}`, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					});
					if (!resp.ok) {
						throw new Error('Failed to fetch company');
					}
					const data = await resp.json();
					setStore({ company: data });
					return data;
				} catch (error) {
					console.error('Error fetching company:', error);
					throw error;
				}
			},

			updateCompany: async (company_id, companyData) => {
				const store = getStore();
				const token = store.token;

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/adminportal/${company_id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(companyData)
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error('Error:', errorData);
						throw new Error('Failed to update company');
					}

					const data = await response.json();
					return data;
				} catch (error) {
					console.error(error);
					throw error;
				}
			},
			deleteCompanyWithDependencies: async (company_id) => {
				const store = getStore();
				const token = store.token;
				const backendUrl = process.env.BACKEND_URL;

				const headers = {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				};

				try {
					// Step 1: Delete requests
					let response = await fetch(`${backendUrl}/api/companies/${company_id}/requests`, {
						method: 'DELETE',
						headers
					});
					if (!response.ok) throw new Error('Failed to delete requests');

					// Step 2: Delete bookings
					response = await fetch(`${backendUrl}/api/companies/${company_id}/bookings`, {
						method: 'DELETE',
						headers
					});
					if (!response.ok) throw new Error('Failed to delete bookings');

					// Step 3: Delete services
					response = await fetch(`${backendUrl}/api/companies/${company_id}/services`, {
						method: 'DELETE',
						headers
					});
					if (!response.ok) throw new Error('Failed to delete services');

					// Step 4: Delete company
					response = await fetch(`${backendUrl}/api/companies/${company_id}`, {
						method: 'DELETE',
						headers
					});
					if (!response.ok) throw new Error('Failed to delete company');

					setStore({ user: null }); // Or any other appropriate action
					return true;
				} catch (error) {
					console.error('Error deleting company with dependencies:', error);
					return false;
				}
			},
			getCompanyPublic: async (company_id) => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/company/${company_id}`, {
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!resp.ok) {
						throw new Error('Failed to fetch company');
					}
					const data = await resp.json();
					return data;
				} catch (error) {
					console.error('Error fetching company:', error);
					throw error;
				}
			},
			getCompanyServicesPublic: async (company_id) => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/services/company/${company_id}`, {
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!resp.ok) {
						throw new Error('Failed to fetch services');
					}
					const data = await resp.json();
					return data;
				} catch (error) {
					console.error('Error fetching services:', error);
					throw error;
				}
			},
			



		},

		deleteServices: async (user_id,service_id) => {
			const store = getStore();
			const opts = {
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + store.token
				}
			};
			try {
				const resp = await fetch(`${process.env.BACKEND_URL}/api/companyservices/${user_id},${service_id}`, opts);
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
