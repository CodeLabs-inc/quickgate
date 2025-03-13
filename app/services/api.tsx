import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
const FormData = global.FormData

//https://server.quickgate.xyz
//http://localhost:4000
const API_URL = 'https://server.quickgate.xyz'

const TOKEN_KEY = "quickgate_token";
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
})


//GLOBAL CALLS
export async function accesAuth() {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (token) {
        //Verify with API
        const response = await fetch(`${API_URL}/account/authenticate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await response.json()

        if (data.success) {

            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            //router.replace('/settings/creation/')
            return true

        } else {
            console.log("Auth Failed - Not Authorized")
            return false

        }

    } else {
        console.log("Token not found")
        return false
    }
}
export async function getToken() {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return token
    } else {
        console.log("token not found")
        return false

        //router.dismissAll()
        //router.replace('/access/login')
    }
}
export async function removeToken() {

    //delete from secure store
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    //delete from axios headers
    axiosInstance.defaults.headers.common["Authorization"] = "";

    //redirect to main selector screen
    router.replace('/main')
}


//AUTH CALLS
export const login = async (email: string, password: string) => {
    try {

        const response = await axiosInstance.post(`/account/login`, {
            email,
            password
        });



        if (response.data.success) {
            await SecureStore.setItemAsync(TOKEN_KEY, response.data.data);
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.data}`;
            return response.data;
        } else {
            return false;
        }

    } catch (error) {
        console.log(error)
        return false
    }

}
export const register = async (email: string, password: string, name: string, surname: string) => {
    try {

        const call = await fetch(`${API_URL}/account/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                name,
                surname,
                source: 'app'
            })
        })


        const data = await call.json();
        return data

    } catch (error) {
        console.log(error)
        return false
    }
}
export const authenticate = async () => {
    try {
        const call = await fetch(`${API_URL}/account/authenticate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }

    }
}



//FAST PAYMENT API
export const lookupPlate = async (plate: string) => {
    try {
        const call = await fetch(`${API_URL}/ticket/pay/lookup/${plate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            data: {
                success: false
            }
        }
    }

}
export const calculateTicket = async (ticketId: string) => {
    try {
        const call = await fetch(`${API_URL}/ticket/pay/calculate/${ticketId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            data: {
                success: false
            }
        }
    }
}
export const confirmTicket = async (ticketId: string) => {
    try {
        const call = await fetch(`${API_URL}/ticket/pay/confirm/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            data: {
                success: false
            }
        }
    }
}
export const createPaymentIntent = async (licensePlate: string) => {
    try {
        const call = await fetch(`${API_URL}/payments/fastpay/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ licensePlate })
        })

        const data = await call.json()
        return data

    } catch (error: any) {
        return {
            data: {
                message: error.message,
                success: false
            }
        }
    }
}
export const confirmPaymentIntent = async (paymentIntentId: string, licensePlate: string) => {
    console.log(paymentIntentId, licensePlate)
    try {
        const call = await fetch(`${API_URL}/payments/fastpay/confirm-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId, licensePlate })
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            data: {
                success: false
            }
        }
    }
}



/* MAPS & LIST PARKINGS */
export const getAllParkings = async () => {
    try {
        const call = await fetch(`${API_URL}/gate/app/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            data: {
                success: false
            }
        }
    }
}



//EXTRA
export const uploadImage = async (file: any) => {

    /* try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const formData = new FormData();
    
        if (file !== null){
            formData.append('file', {
              uri: file,
              name: `hazel.jpg`, // The name of the file
              type: 'image/jpeg', // The MIME type of the file
            });
        }
    
    
        // Make the POST request using fetch
        const configCall = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        }
    
        const response = await axiosInstance.post(`/food/add`, formData , configCall);
    
        return response

    } catch (error) {
     
        return {
            data: {
                success: false
            }
        }
    } */
}



/* SETTINGS */
export const addCar = async (licensePlate: string, vehicleName: string) => {
    try {
        const call = await fetch(`${API_URL}/vehicles/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            },
            body: JSON.stringify({
                licensePlate,
                vehicleName
            })
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }
    }
}
export const getCars = async () => {
    try {
        const call = await fetch(`${API_URL}/vehicles/personal`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }
    }
}
export const deleteCar = async (vehicleId: string) => {
    try {
        const call = await fetch(`${API_URL}/vehicles/delete/${vehicleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }
    }
}
export const getNotificationSettings = async () => {
    try {
        const call = await fetch(`${API_URL}/account/settings/notifications/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            }
        })
        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }
    }
}
export const updateNotificationSettings = async (balanceUse: boolean, parking: boolean, exit: boolean, lowBalance: boolean, alerts: boolean) => {
    try {
        const call = await fetch(`${API_URL}/account/settings/notifications/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            },
            body: JSON.stringify({
                balanceUse,
                parking,
                exit,
                lowBalance,
                alerts
            })
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }
    }
}



/* TICKETS */
export const getUserActiveTickets = async () => {
    try {
        const call = await fetch(`${API_URL}/ticket/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }
    }
}
export const getUserActiveSubscriptions = async () => {
    try {
        const call = await fetch(`${API_URL}/ticket/user/free-access`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`
            }
        })

        const data = await call.json()
        return data

    } catch (error) {
        return {
            success: false
        }
    }
}



