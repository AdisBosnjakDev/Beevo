

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
