// utils/api.ts
import axios from "axios";

const API_KEY = "bfcc49b2d8d805f80f06facd";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

export async function getExchangeRate(base: string, target: string) {
  try {
    const response = await axios.get(`${BASE_URL}/${base}`);
    if (response.data.result !== "success") {
      throw new Error("Échec de la récupération des taux de change.");
    }

    const rate = response.data.conversion_rates[target];
    if (!rate) {
      throw new Error(`La devise cible "${target}" n'est pas disponible.`);
    }

    return {
      base,
      target,
      rate,
    };
  } catch (err: any) {
    console.error("Erreur API :", err.message);
    throw err;
  }
}
