const uri = "https://cityinfo.buchwaldshave34.dk/api/City";
const uriCountry = "https://cityinfo.buchwaldshave34.dk/api/Country";
const uriLang = "https://cityinfo.buchwaldshave34.dk/api/Language";
let todos = [];
let ThisUserName = "UserJacobA";

function getItems() {
    setTimeout(function () {
        fetch(uri + "?UserName=" + ThisUserName)
            .then(response => response.json())
            .then(data => _displayItems(data))
            .catch(error => console.error('Unable to get items.', error));
    }, 100);
}

function setUpSelectCountryBox(sBox) {
    fetch(uriCountry + "?UserName=" + ThisUserName,)
        .then(response => response.json())
        .then(item => {
            item.forEach(i => {
                var option = document.createElement('option');
                option.text = i.countryID + ") " + i.countryName;
                sBox.appendChild(option);
            });
        })
        .catch(error => console.error('Unable to add item.', error));
}

function getCountries() {
    const newCountrySelect = document.getElementById('newCountrySelect');
    setUpSelectCountryBox(newCountrySelect);
}

function getLanguages() {
    const languageSelect = document.getElementById('languageSelectionArea');
    fetch(uriLang + "?UserName=" + ThisUserName,)
        .then(response => response.json())
        .then(item => {
            item.forEach(i => {
                var option = document.createElement('input');
                var optionLabel = document.createElement('label');
                option.id = i.languageId;
                option.type = 'checkbox';
                optionLabel.setAttribute('for', i.languageId);
                optionLabel.innerHTML = i.languageName;
                option.value = "asd";
                //console.log(optionLabel);
                languageSelect.appendChild(option);
                languageSelect.appendChild(optionLabel);
            });
        })
        .catch(error => console.error('Unable to add item.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const descriptionArea = document.getElementById('descriptionArea');
    const addCountrySelectBox = document.getElementById('newCountrySelect');
    const splitCountrySelected = addCountrySelectBox.value;

    let languageSelect = document.getElementById('languageSelectionArea');
    const l = document.querySelectorAll('#languageSelectionArea input[type=checkbox]');
    let langId;

    for (var i = 0; i < l.length; i++) {
        if (l[i].checked) {
            langId = l[i].id;
            console.log(l);
            break;
        }
    }

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        countryID: splitCountrySelected.split(')')[0],
        description: descriptionArea.value,
        cityLanguages: item1 = {
            cityId: 0,
            languageId: langId
        }
    };

    console.log(item);

    fetch(uri + "?UserName=" + ThisUserName, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}` + "?UserName=" + ThisUserName, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.cityId === id);
    const sBox = document.getElementById('UpdateCountrySelect');

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.cityId;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('descriptionAreaUpdate').value = item.description;
    setUpSelectCountryBox(sBox);
    console.log(item.cityId);


    document.getElementById('editForm').style.display = 'block';

}
function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const itemCountryId = document.getElementById('UpdateCountrySelect').value.split(')')[0];
    const item = {
        cityId: itemId,
        name: document.getElementById('edit-name').value.trim(),
        description: document.getElementById('descriptionAreaUpdate').value,
        countryID: parseInt(itemCountryId, 10)
    };

    fetch(`${uri}/${itemId}` + "?UserName=" + ThisUserName, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            const tBody = document.getElementById('cities');
            tBody.innerHTML = '';
        })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('cities');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.cityId})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.cityId})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        let countryNode = document.createTextNode(item.country.countryName);
        td3.appendChild(countryNode);

        let td4 = tr.insertCell(3);
        let languages = "";
        item.cityLanguages.forEach(l => {
            languages += l.languageName + ", "
        });
        let languageNode = document.createTextNode(languages);
        //console.log(item);
        td4.appendChild(languageNode);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });

    todos = data;
}