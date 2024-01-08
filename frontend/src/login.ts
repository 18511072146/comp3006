import { api } from "./api";

export async function signup(name: string, phone: string, location: string, email: string, password: string): Promise<boolean> {

    const response = await api.post('/hotel', {
        "email": email,
        "password": password,
        "name": name,
        "phone": phone,
        "location": location,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log(response);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("hotelId", response.data._id);
    return true;
}

export async function login(email: string, password: string): Promise<boolean> {

    const response = await api.post('/hotel/login', {
        "email": email,
        "password": password
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log(response.data);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("hotelId", response.data._id);
    return true;
}

export function isLoggedin(): boolean {
    return localStorage.getItem("email") !== null;
}

export function logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("hotelId");
    location.reload();
}