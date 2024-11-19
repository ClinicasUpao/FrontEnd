const countries = [
    "Manzana",
    "Banana",
    "Cereza"
];;
const inputElem = document.getElementById('search-input');
const resultsElem = document.getElementById('autocomplete-results');

async function init() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    countries.push(...data.map(country => country.name.common));
}

function autocomplete(event) {
    const value = inputElem.value.toLowerCase();
    resultsElem.innerHTML = '';
    
    if (!value) {
        resultsElem.classList.add('hidden');
        return;
    }

    const filteredCountries = countries.filter(country => 
        country.toLowerCase().startsWith(value)
    );

    filteredCountries.forEach(country => {
        const li = document.createElement('li');
        li.textContent = country;
        li.onclick = () => selectItem(country);
        resultsElem.appendChild(li);
    });

    resultsElem.classList.remove('hidden');
}

function selectItem(country) {
    inputElem.value = country;
    resultsElem.classList.add('hidden');
}

inputElem.addEventListener('input', autocomplete);
init();