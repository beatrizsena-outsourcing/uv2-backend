import fetch from "node-fetch";

function validateContract(data) {
  console.log("=== VALIDAÇÃO ESTRUTURAL V1 ===");

  if (!data.success) throw new Error("Missing success");

  if (!Array.isArray(data.ranking)) {
    throw new Error("ranking não é array");
  }

  const item = data.ranking[0];

  const requiredFields = [
    "vehicleId",
    "km",
    "avgSpeed",
    "activeDays",
    "hourPeak",
    "score"
  ];

  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new Error(`Campo faltando: ${field}`);
    }
  }

  if (typeof item.score !== "number") {
    throw new Error("score inválido");
  }

  console.log("✅ CONTRATO V1 VÁLIDO");
}

async function run() {
  const res = await fetch("http://localhost:3000/api/dashboard/kpis");
  const data = await res.json();

  validateContract(data);
}

run();