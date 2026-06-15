console.log("Community Help Hub Loaded Successfully");

const searchBox = document.getElementById("searchInput");

searchBox.addEventListener("keyup", function() {

    let filter = searchBox.value.toLowerCase();

    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        let text = card.innerText.toLowerCase();

        if(text.includes(filter)){
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});
const feedbackBtn = document.querySelector(".contact-form button");

if(feedbackBtn){

    feedbackBtn.addEventListener("click", function(){

        alert("Thank you for your feedback!");

    });

}
const locationSelect = document.getElementById("locationSelect");
const results = document.getElementById("results");

const services = {
    anakapalle: [
        "🏥 Area Hospital, Anakapalle",
        "👮 Anakapalle Police Station",
        "🏛️ MeeSeva Center"
    ],

    visakhapatnam: [
        "🏥 King George Hospital (KGH)",
        "👮 Dwaraka Police Station",
        "🏛️ MeeSeva Center Visakhapatnam"
    ]
};

locationSelect.addEventListener("change", function () {

    const location = this.value;

    if (!location) {
        results.innerHTML = "";
        return;
    }

    let output = "<div class='card'><h3>Available Services</h3>";

    services[location].forEach(service => {
        output += `<p>${service}</p>`;
    });

    output += "</div>";

    results.innerHTML = output;
});
const schemeFilter = document.getElementById("schemeFilter");

if (schemeFilter) {

    schemeFilter.addEventListener("change", function () {

        const value = this.value;

        const cards = document.querySelectorAll(".scheme-card");

        cards.forEach(card => {

            if (value === "all" || card.dataset.category === value) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

}
const districtSelect = document.getElementById("districtSelect");
const hospitalResults = document.getElementById("hospitalResults");

const districtHospitals = {

    alluri: {
        district: "Alluri Sitharama Raju",
        map: "https://www.google.com/maps/search/hospitals+in+Alluri+Sitharama+Raju"
    },

    anakapalle: {
        district: "Anakapalle",
        map: "https://www.google.com/maps/search/hospitals+in+Anakapalle"
    },

    anantapur: {
        district: "Anantapur",
        map: "https://www.google.com/maps/search/hospitals+in+Anantapur"
    },

    annamayya: {
        district: "Annamayya",
        map: "https://www.google.com/maps/search/hospitals+in+Annamayya"
    },

    bapatla: {
        district: "Bapatla",
        map: "https://www.google.com/maps/search/hospitals+in+Bapatla"
    },

    chittoor: {
        district: "Chittoor",
        map: "https://www.google.com/maps/search/hospitals+in+Chittoor"
    },

    eastgodavari: {
        district: "East Godavari",
        map: "https://www.google.com/maps/search/hospitals+in+East+Godavari"
    },

    eluru: {
        district: "Eluru",
        map: "https://www.google.com/maps/search/hospitals+in+Eluru"
    },

    guntur: {
        district: "Guntur",
        map: "https://www.google.com/maps/search/hospitals+in+Guntur"
    },

    kakinada: {
        district: "Kakinada",
        map: "https://www.google.com/maps/search/hospitals+in+Kakinada"
    },

    konaseema: {
        district: "Dr. B.R. Ambedkar Konaseema",
        map: "https://www.google.com/maps/search/hospitals+in+Konaseema"
    },

    krishna: {
        district: "Krishna",
        map: "https://www.google.com/maps/search/hospitals+in+Krishna"
    },

    kurnool: {
        district: "Kurnool",
        map: "https://www.google.com/maps/search/hospitals+in+Kurnool"
    },

    nandyal: {
        district: "Nandyal",
        map: "https://www.google.com/maps/search/hospitals+in+Nandyal"
    },

    ntr: {
        district: "NTR District",
        map: "https://www.google.com/maps/search/hospitals+in+NTR+District"
    },

    palnadu: {
        district: "Palnadu",
        map: "https://www.google.com/maps/search/hospitals+in+Palnadu"
    },

    parvathipuram: {
        district: "Parvathipuram Manyam",
        map: "https://www.google.com/maps/search/hospitals+in+Parvathipuram+Manyam"
    },

    prakasam: {
        district: "Prakasam",
        map: "https://www.google.com/maps/search/hospitals+in+Prakasam"
    },

    srikakulam: {
        district: "Srikakulam",
        map: "https://www.google.com/maps/search/hospitals+in+Srikakulam"
    },

    spsrnellore: {
        district: "SPSR Nellore",
        map: "https://www.google.com/maps/search/hospitals+in+Nellore"
    },

    tirupati: {
        district: "Tirupati",
        map: "https://www.google.com/maps/search/hospitals+in+Tirupati"
    },

    visakhapatnam: {
        district: "Visakhapatnam",
        map: "https://www.google.com/maps/search/hospitals+in+Visakhapatnam"
    },

    vizianagaram: {
        district: "Vizianagaram",
        map: "https://www.google.com/maps/search/hospitals+in+Vizianagaram"
    },

    westgodavari: {
        district: "West Godavari",
        map: "https://www.google.com/maps/search/hospitals+in+West+Godavari"
    },

    ysrkadapa: {
        district: "YSR Kadapa",
        map: "https://www.google.com/maps/search/hospitals+in+Kadapa"
    }
};

if (districtSelect) {

    districtSelect.addEventListener("change", function() {

        const district = this.value;

        if (!district) {
            hospitalResults.innerHTML = "";
            return;
        }

        const selected = districtHospitals[district];

        if (!selected) {
            hospitalResults.innerHTML = `
                <div class="card">
                    <h3>Data Not Available</h3>
                    <p>Hospital information for this district will be updated soon.</p>
                </div>
            `;
            return;
        }

        hospitalResults.innerHTML = `
            <div class="card">
                <h3>🏥 ${selected.district}</h3>

                <p>
                    Click below to view all hospitals in this district on Google Maps.
                </p>

                <a href="${selected.map}" target="_blank">
                    <button>View All Hospitals</button>
                </a>
            </div>
        `;
    });

}