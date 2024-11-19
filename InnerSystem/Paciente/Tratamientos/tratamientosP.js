function toggleAnswer(questionElement) {
    const answerElement = questionElement.nextElementSibling; // Selecciona el siguiente elemento (respuesta)
    const isActive = answerElement.style.display === "block"; // Verifica si la respuesta está activa

    // Alterna la visibilidad de la respuesta
    answerElement.style.display = isActive ? "none" : "block";

    // Alterna la clase activa en la pregunta
    questionElement.classList.toggle("active");
}