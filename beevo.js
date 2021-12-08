<!-- Load Google Places API -->
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDm6tiCUIKMCUitLYlOhFhrQpf884M6v8&libraries=places"></script>
<script>
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
</script>
<script>
  var Webflow = Webflow || [];
  Webflow.push(function () {
  	const file = document.getElementById("Upload-File");
  	var uploadData;
    var fileList = [];

    let files = []
    let newFiles = [];
    let filesContainer = [];
    file.addEventListener("change", function (e) {
    	fileList = [];
      for (let i = 0; i < file.files.length; i++) {
      	fileList.push("https://webflow.com/files/619f088e1c76423151a65395/formUploads/" + file.files[i].name.replaceAll(" ","%20"));
        
        let tmp = file.files[i];
        newFiles.push(file);
        //console.log(fileList[i]);
      	//console.log(file.data("value"));
      }
    
      newFiles.forEach(file => {
        let fileElement = $(`<p>${file.name}</p>`);
        fileElement.data('fileData', file);
        console.log(fileElement);
        filesContainer.push(fileElement);

        fileElement.click(function(event) {
          let fileElement = $(event.target);
          let indexToRemove = files.indexOf(fileElement.data('fileData'));
          fileElement.remove();
        });
      });
    
      console.log(newFiles);
    }, false);

    $('form[data-name="Email Form"]').submit(function (e) {
      const date = document.getElementById("Lease-Date");
      if (date.hasAttribute("required") == false || (date.hasAttribute("required") == true && date.value != null && date.value != "" && date.value != undefined)) {
        e.preventDefault();
        const $form = $(this);

        const $submit = $("[type=submit]", $form);
        const originalText = $submit.val();
        $submit.val($submit.data('wait'));

        const fname = $("[name=Client-First-Name]", $form).val();
        const lname = $("[name=Client-Last-Name]", $form).val();
        const email = $("[name=Email]", $form).val();
        const phone = $("[name=Phone]", $form).val();
        let leaseDate = $("[name=Lease-Date]", $form).val();
        const businessName = $("[name=Company-Name]", $form).val();
        const address = $("[name=Lease-Address]", $form).val();
        const address2 = $("[name=Lease-Address-2]", $form).val();
        const suburb = $("[name=Lease-Address-3]", $form).val();
        const postalcode = $("[name=Lease-Address-4]", $form).val();
        const state = $("[name=Lease-Address-5]", $form).val();
        const agentEmail = $("[name=Agent-Email]", $form).val();
        const message = $("[name=Message]", $form).val();

        // API doesn't accept empty value, set to nullable
        if (leaseDate == "" || leaseDate == undefined) {
          leaseDate = null;
        }

        let newConnection = false;
        let tempConnection = false;
        let propertyManagement = false;
        let healthCheck = false;

        // Get the selected radio button
        if (document.querySelector('input[name="radio"]:checked').value == "New Connection") {
          newConnection = true;
        } else if (document.querySelector('input[name="radio"]:checked').value == "Temporary Connection") {
          tempConnection = true;
        } else if (document.querySelector('input[name="radio"]:checked').value == "Property Management") {
          propertyManagement = true;
        } else healthCheck = true;

        let addressVal = "";
        if (!is_address_expanded) {
          addressVal = address;
        } else {
          addressVal += address;
          if (address2 != undefined) {
            addressVal += ", " + address2;
          }

          if (suburb != undefined) {
            addressVal += ", " + suburb;
          }

          if (postalcode != undefined) {
            addressVal += ", " + postalcode;
          }

          if (state != undefined) {
            addressVal += ", " + state;
          }
        }

        let uploadUrl = null;
        let attachments = null;
        if ($("#Upload-File").data("value") != undefined) {
        	for (let i = 0; i < fileList.length; i++) {
        		
            uploadUrl = "https://webflow.com/files/619f088e1c76423151a65395/formUploads/" + $("#Upload-File").data("value");
            attachments = [{"url" : uploadUrl}];
          }
        }

        var settings = {
        	url: "https://api.airtable.com/v0/appIZ3deN3WDsIaEt/Table%201/",
          //url: "https://api.airtable.com/v0/appvBheLYDiiA4PJf/pending-import",
          method: "POST",
          headers: {
          	Authorization: "Bearer keyNzrpYV6F8AO4f8",
            //Authorization: "Bearer keyKaCIrcdtS3mJfH",
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            records: [
              {
                fields: {
                  "First Name": fname,
                  "Last Name": lname,
                  "Contact Number": phone,
                  "Email": email,
                  "Date": leaseDate,
                  "Business Name": businessName,
                  "Lease Address": addressVal,
                  "Referring Email": agentEmail,
                  Info: message,
                  "New Connection": newConnection,
                  "Temporary Connection": tempConnection,
                  "Property Management": propertyManagement,
                  "Health Check": healthCheck,
                  "Attachments": attachments,
                },
              },
              {
                fields: {},
              },
            ],
          }),
        };

        console.log(settings);

        $.ajax(settings).done(function (response) {
          console.log(response);
          $form
            .hide()
            .siblings(".w-form-done").show()
            .siblings(".w-form-fail").hide();
          $submit.val(originalText);
        }).fail(res => {
          console.log(res);
          $form
            .siblings(".w-form-done").hide()
            .siblings(".w-form-fail").show();
          $submit.val(originalText);
        });
  		}
    });
  });
</script>
