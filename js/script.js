// Array inicial con 3 registros
let guides = [
  {
    recipient: "Carlos Pérez",
    guideNumber: "1001",
    origin: "Puebla",
    destination: "CDMX",
    creationDate: "2025-05-01",
    status: "Pendiente"
  },
  {
    recipient: "María López",
    guideNumber: "1002",
    origin: "Guadalajara",
    destination: "Monterrey",
    creationDate: "2025-05-02",
    status: "En tránsito"
  },
  {
    recipient: "Juan García",
    guideNumber: "1003",
    origin: "Acapulco",
    destination: "Toluca",
    creationDate: "2025-05-03",
    status: "Entregado"
  }
];

// Referencias al DOM
const form = document.getElementById("guideForm");
const guidesContainer = document.getElementById("guidesContainer");
const registeredGuidesElement = document.getElementById("registeredGuides");

// Función para validar número único
function isUniqueGuideNumber(number) {
  return !guides.some(guide => guide.guideNumber === number);
}

// Función para renderizar guías en la tabla
function renderGuides() {
  guidesContainer.innerHTML = ""; // limpiar tabla

  guides.forEach((guide, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${guide.guideNumber}</td>
      <td>${guide.status}</td>
      <td>${guide.origin}</td>
      <td>${guide.destination}</td>
      <td>${guide.creationDate}</td>
      <td>
        <div class="table__button-update" data-index="${index}">
          <img src="./img/update.png" class="button__icon-update" alt="Actualizar">
          <label>Actualizar</label>
        </div>
      </td>
    `;

    guidesContainer.appendChild(row);
  });

  // Listeners para abrir modal
  document.querySelectorAll(".table__button-update").forEach(btn => {
    btn.addEventListener("click", function () {
      currentGuideIndex = this.dataset.index;
      const guide = guides[currentGuideIndex];
      modalGuideInfo.textContent = `Guía #${guide.guideNumber} - Estado actual: ${guide.status}`;
      newStatusSelect.value = guide.status;
      modal.style.display = "block";
    });
  });

  // Actualizar contador en el panel
  if (registeredGuidesElement) {
    registeredGuidesElement.textContent = guides.length;
  }
}

// Capturar evento submit
if (form) {
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtener valores
    const recipient = document.getElementById("recipient").value.trim();
    const guideNumber = document.getElementById("guideNumber").value.trim();
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const creationDate = document.getElementById("creationDate").value;
    const status = document.getElementById("status").value;

    // Validaciones
    if (!recipient || !guideNumber || !origin || !destination || !creationDate || !status) {
      alert("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (!isUniqueGuideNumber(guideNumber)) {
      alert("❌ El número de guía ya existe.");
      return;
    }

    // Crear objeto guía
    const newGuide = { recipient, guideNumber, origin, destination, creationDate, status };

    // Guardar y mostrar
    guides.push(newGuide);
    renderGuides();

    // Limpiar formulario
    form.reset();
  });
}

// Pintar registros iniciales al cargar la página
document.addEventListener("DOMContentLoaded", renderGuides);

// Modal referencias
const modal = document.getElementById("updateModal");
const closeModal = document.querySelector(".modal__close");
const modalGuideInfo = document.getElementById("modalGuideInfo");
const newStatusSelect = document.getElementById("newStatus");
const saveStatusBtn = document.getElementById("saveStatus");

let currentGuideIndex = null;

// Guardar nuevo estado desde modal
if (saveStatusBtn) {
  saveStatusBtn.addEventListener("click", function () {
    if (currentGuideIndex !== null) {
      const currentStatus = guides[currentGuideIndex].status;
      const newStatus = newStatusSelect.value;

      // Validar flujo
      if (
        (currentStatus === "Pendiente" && newStatus === "En tránsito") ||
        (currentStatus === "En tránsito" && newStatus === "Entregado") ||
        currentStatus === newStatus
      ) {
        guides[currentGuideIndex].status = newStatus;
        // Actualizar fecha de última actualización
        guides[currentGuideIndex].creationDate = new Date().toISOString().split("T")[0];
        renderGuides();
        modal.style.display = "none";
      } else {
        alert("⚠️ El flujo debe ser Pendiente → En tránsito → Entregado.");
      }
    }
  });
}

// Cerrar modal
if (closeModal) {
  closeModal.addEventListener("click", () => modal.style.display = "none");
}
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
