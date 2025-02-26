'use server' 

export async function gettasks(url: string) {
    try {
        const URL = url;
        const res = await fetch(`${URL}/api/gettasks`);
        const tasks = await res.json();
        return tasks;        
    } catch (error) {
        console.log(error);
        return null;
    }
}