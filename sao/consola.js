document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', executeCommand);
});

function executeCommand() {
    const inputCommand = document.getElementById('input').value;
    const outputDiv = document.getElementById('output');

    document.getElementById('input').value = '';
    switch (inputCommand.split(' ')[0]) {
        case '/system_time':
            const systemTime = new Date();
            const formattedTime = `<br>${systemTime.getDate()}/${systemTime.getMonth() + 1}/${systemTime.getFullYear()} ${systemTime.getHours()}:${systemTime.getMinutes()}:${systemTime.getSeconds()}`;
            outputDiv.innerHTML += formattedTime + '<br>';
            break;
        case '/list_users':
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'listusers.php', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    displayUserList(xhr.responseText);
                } else if (xhr.status != 200) {
                    output('Error al obtener la lista de usuarios.');
                }
            };
            xhr.send();
            break;
        case '/profile':
            const userId = inputCommand.split(' ')[1];
            if (userId) {
                var profileXhr = new XMLHttpRequest();
                profileXhr.open('GET', 'profile.php?id_user=' + userId, true);
                profileXhr.onreadystatechange = function () {
                    if (profileXhr.readyState == 4 && profileXhr.status == 200) {
                        displayUserProfile(profileXhr.responseText);
                    } else if (profileXhr.status != 200) {
                        output('Error al obtener el perfil del usuario.');
                    }
                };
                profileXhr.send();
            } else {
                output('Comando /profile requiere un ID de usuario.');
            }
            break;
        case '/dungeons':
            const userDungeonsId = inputCommand.split(' ')[1];
            if (userDungeonsId) {
                var dungeonsXhr = new XMLHttpRequest();
                dungeonsXhr.open('GET', 'userdungeons.php?id_user=' + userDungeonsId, true);
                dungeonsXhr.onreadystatechange = function () {
                    if (dungeonsXhr.readyState == 4 && dungeonsXhr.status == 200) {
                        displayUserDungeons(dungeonsXhr.responseText);
                    } else if (dungeonsXhr.status != 200) {
                        output('Error al obtener las mazmorras del usuario.');
                    }
                };
                dungeonsXhr.send();
            } else {
                output('Comando /dungeons requiere un ID de usuario.');
            }

function displayUserList(userList) {
    const usersArray = userList.split('\n');

    const restOfUsers = usersArray.slice(1);

    restOfUsers.forEach(userData => {
  
        userData = userData.replace(/\r/g, '');

        const [id_user, name, status, accesstime, latitude, longitude] = userData.split(';');

        const formattedOutput = `${id_user}: ${name} (${accesstime}) (${status}) (${latitude}, ${longitude})`;

        output(formattedOutput);
    });
}


function displayUserProfile(userProfile) {
    const outputDiv = document.getElementById('output');
    const { username, real_name, gendre, birth_year, active, game_race, image } = JSON.parse(userProfile);

    const formattedOutput = `
        Username: ${username}<br>
        Real Name: ${real_name}<br>
        Gender: ${gendre}<br>
        Birth Year: ${birth_year}<br>
        Active: ${active ? 'Yes' : 'No'}<br>
        Game Race: ${game_race}<br>
    `;

    outputDiv.innerHTML += formattedOutput;



    const imgElement = document.createElement('img');
    imgElement.alt = 'Profile Photo';

  
    if (image && image.trim() !== '') {
        imgElement.src = image;
    } else {
        imgElement.src = 'https://st4.depositphotos.com/29453910/37778/v/450/depositphotos_377785374-stock-illustration-hand-drawn-modern-man-avatar.jpg'; 
    }

   
    imgElement.style.width = '100px'; 
    imgElement.style.height = '100px'; 

    imgElement.onerror = function () {
        outputDiv.appendChild(document.createTextNode('Profile Photo: Image not available'));
    };

    outputDiv.appendChild(imgElement);
}



function displayUserDungeons(userDungeons) {
    const outputDiv = document.getElementById('output');
    const dungeonsArray = JSON.parse(userDungeons);

    
    const header = Object.keys(dungeonsArray[0]);
    output(header.join(' | ') + '<br>');

   
    dungeonsArray.forEach(dungeonData => {
        const formattedOutput = Object.values(dungeonData).join(' | ') + '<br>';
        output(formattedOutput);
    });
}



function output(message) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML += message + '<br>';
}
}
}