<!-- Load Google Places API -->
console.log("imported");
var queryString = window.location.search;
var URLSearchParams_wb = new URLSearchParams(queryString);

const utmParameters = [
	"utm_source", 
	"utm_medium", 
	"utm_campaign"
];

for (const utm_element of utmParameters) {
	if (URLSearchParams_wb.has(utm_element)) {
		var value = URLSearchParams_wb.get(utm_element);
		$("." + utm_element).val(value);
	}
}

let is_address_expanded = false;
let autocomplete;
let expand_address = document.querySelector("#Cant-Find-Address");
let address = document.querySelector("#Lease-Address");
let address2 = document.querySelector("#Lease-Address-2");
let suburb = document.querySelector("#Lease-Address-3");
let postalcode = document.querySelector("#Lease-Address-4");
let state = document.querySelector("#Lease-Address-5");

function ShowAllFields() {
	address2.style.display = "block";
	suburb.style.display = "block";
	postalcode.style.display = "block";
	state.style.display = "block";
	expand_address.style.display = "none";
	is_address_expanded = true;

	if (address.value != "" && address.value != undefined) {
		address.value = address.value.split(",")[0];
	}
}

expand_address.addEventListener("click", ShowAllFields);
autocomplete = new google.maps.places.Autocomplete(address, {
	componentRestrictions: { country: ["au"] },
	fields: ["address_components", "geometry"],
	types: ["address"],
});

autocomplete.addListener("place_changed", FillInAddress);

function FillInAddress() {
	const place = autocomplete.getPlace();
	let address1 = "";
	let postcode = "";

	for (const component of place.address_components) {
		const componentType = component.types[0];
		console.log(component);
		console.log("componentType: " + componentType);
		switch (componentType) {
		case "subpremise":
			if (component.long_name != undefined) {
				address1 = `${component.long_name}/`;
			  }
			break;
		case "street_number": 
		  if (component.long_name != undefined) {
			address1 += `${component.long_name} `;
		  }
		  break;
		case "route": 
		  address1 += component.short_name;
		  break;
		case "postal_code": 
		  postcode = `${component.long_name}${postcode}`;
		  break;
		case "postal_code_suffix": 
		  postcode = `${postcode}-${component.long_name}`;
		  break;
		case "locality":
		  suburb.value = component.long_name;
		  break;
		case "administrative_area_level_1": 
		  state.value = component.short_name;
		  break;
	}
}

postalcode.value = postcode;

if (!is_address_expanded) {
	address.value = address1 + ", " + suburb.value + ", " + postcode + ", " + state.value;
} else address.value = address1;
}

document.getElementById("Upload-File").setAttribute("multiple","");
const newConn = document.getElementById("New-Connection");
const tempConn = document.getElementById("Temporary-Connection");
const propManagement = document.getElementById("Property-Management");
const healthCheck = document.getElementById("Health-Check");
const dateField = document.getElementById("Lease-Date");

newConn.addEventListener("change", function handleChange(e) {
	dateField.setAttribute("required", "");  
});
tempConn.addEventListener("change", function handleChange(e) {
	dateField.removeAttribute("required");
});
propManagement.addEventListener("change", function handleChange(e) {
	dateField.removeAttribute("required");
});
healthCheck.addEventListener("change", function handleChange(e) {
	dateField.removeAttribute("required");
});
