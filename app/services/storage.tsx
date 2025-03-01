import * as SecureStore from "expo-secure-store";

export const saveDashboardData = async (data: any) => {
    try {
        await SecureStore.setItemAsync('DASHBOARD_DATA', JSON.stringify(data));
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
export const getDashboardData = async () => {
    try {
        const data = await SecureStore.getItemAsync('DASHBOARD_DATA');
        if (!data) return
        return JSON.parse(data);
    } catch (error) {
        console.log(error)
        return 
    }
}