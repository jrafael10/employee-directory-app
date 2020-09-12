
/*Selecting the elements through the DOM selectors*/
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const search = document.querySelector('.search-container');

const url = 'https://randomuser.me/api/?results=12&&nat=us' //Random User generator API url 


/*Sending a request to the Random User Generator API to retrieve the data of 12 random
employees*/
fetch(url)
    .then(res => res.json())
    .then(data => {
        createSearchCardsModals(data.results)
    })
    .catch(error => console.log('Looks like there was a problem!', error));


/*function that handles all the functionalities on this application and 
that displays the search input form, employee cards, and modals

*/    
function createSearchCardsModals(employees){
    console.log(employees);
    createSearch();
    generateCard(employees, createModal)
   
    const employeeNames = document.querySelectorAll('.card-info-container #name');
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.card');
    const modal_container = document.querySelectorAll('.modal-container');
    const modal_btn_container = document.querySelectorAll('.modal-btn-container');
    searchName(searchInput, employeeNames, cards)
 
    for(let i = 0; i<employees.length; i++){
        const closeButton = modal_container[i].querySelector('.modal-close-btn');
        const nextButton = modal_btn_container[i].querySelector('#modal-next');
        const prevButton = modal_btn_container[i].querySelector('#modal-prev');
        showModal(cards[i], modal_container[i]);
        closeModal(closeButton, modal_container[i]);
        nextModal(nextButton, modal_container);
        prevModal(prevButton,modal_container)
    } 
    
}


/****HTML builder functions*** */


/*function that creates the search input*/
function createSearch(){
    //const search = document.querySelector('.search-container');
let searchForm = `<form action="#" method="get">`;
searchForm += `<input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`;
searchForm += `</form>`;
search.insertAdjacentHTML('beforeend', searchForm);  
  

}
          

/*function that creates and generates employee cards*/
function generateCard(employees, build){
    employees.map(employee => {
    const card = document.createElement('div');
    card.className = "card";
    const card_img_container = document.createElement('div');
    card_img_container.className = "card-img-container";
    const img = `<img class="card-img" src="${employee.picture.large}" alt="profile picture">`;
    card_img_container.insertAdjacentHTML('beforeend', img);
        
    const card_info_container = document.createElement('div');
    card_info_container.className = 'card-info-container';
    const info = `<h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                        <p class="card-text">${employee.email}</p>
                        <p class="card-text cap">${employee.location.city}</p>`;

    card_info_container.insertAdjacentHTML('beforeend', info); 
    card.appendChild(card_img_container);
        card.appendChild(card_info_container); 
        gallery.appendChild(card);
        build(employee);

    });
}  


/*function that creates modals*/
function createModal(employee){
    const modal_container = document.createElement('div');
    modal_container.className = 'modal-container';
    modal_container.style.display = 'none';
    const modal = document.createElement('div');
    modal.className = 'modal';

    const button = `<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>`;
    modal.insertAdjacentHTML('beforeend', button);
    const modal_info_container = document.createElement('div');
    modal_info_container.className = 'modal-info-container';
    let emp_info= `<img class="modal-img" src="${employee.picture.large}" alt="profile picture">`;
    emp_info += `<h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>`;
    emp_info +=`<p class="modal-text">${employee.email}</p>`
    emp_info += `<p class="modal-text cap">${employee.location.city}</p><hr>`;
    
    emp_info += `<p class="modal-text">${employee.cell.replace(/-/, " ")}</p>`; //converting cell number's format to (xxx) xxx-xxxx with replace method
    emp_info += `<p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state} ${employee.location.postcode}</p>`;
    emp_info += `<p class="modal-text">Birthday: ${mm_dd_yy(employee.dob.date)}</p>`
    modal_info_container.insertAdjacentHTML('beforeend', emp_info);

    modal.appendChild(modal_info_container);
    modal_container.appendChild(modal);
    //Creating the prev & next buttons 
    const modal_btn_container = document.createElement('div');
    modal_btn_container.className = 'modal-btn-container';
    let buttons = `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>`;
    buttons += `<button type="button" id="modal-next" class="modal-next btn">Next</button>`;
    modal_btn_container.insertAdjacentHTML('beforeend', buttons);
    modal_container.appendChild(modal_btn_container);
     body.appendChild(modal_container);

}

/***helper function***/

/*function that converts date to mm/dd/yy format*/
function mm_dd_yy(date){
    const birthdate = new Date(date) ;
    const month = (birthdate.getMonth() + 1 < 10) ? "0" + (birthdate.getMonth() + 1) : birthdate.getMonth() + 1 ;
    const day = (birthdate.getDate()  < 10) ? "0" + birthdate.getDate() : birthdate.getDate() ;
    const year = birthdate.getFullYear();
    const mm_dd_yy = `${month}/${day}/${year}`;  
    return mm_dd_yy;                
 }

/*********Event listener functions *******/


/*function that filters the directory when searching the employee's name  */
function searchName(input, names, cards ){
    input.addEventListener('keyup', ()=>{
         const inputValue = input.value.toUpperCase();
        for(let i = 0; i<names.length; i++){
             const name = names[i].textContent.toUpperCase();
             
             if(name.indexOf(inputValue.trim()) > -1 || inputValue.trim() == '' || !/\S/.test(inputValue)){
                     cards[i].style.display = "";
                } else {
                 cards[i].style.display = "none";
             }
         }
 
     } )
 }

 /*function that shows the employee's modal when user clicks on the employee's card*/
function showModal(employee_card, modal){
    employee_card.addEventListener('click', () => {
        modal.style.display  = '';
        
    })
};

/*function that closes the modal when close button is clicked*/
function closeModal(closebtn, modal){
    closebtn.addEventListener('click', ()=>{
       modal.style.display = 'none';
    });
}


/**function that allows user to go to the next employee once the next button is pressed
 * on the modal window * **/ 
function nextModal(btn, modals){
    btn.addEventListener('click', (e) =>{
        const selected_card = e.target.parentNode.parentNode;
        let index = [...modals].indexOf(selected_card);
        
        
        if(index == (modals.length-1)){
            modals[index].style.display = 'none';
             index = 0;
             modals[index].style.display = '';
         }else {
            index++; 
            modals[index].style.display = '';
          
          if(index > 0) {
            modals[index-1].style.display = 'none';
            

          }     
         }


    })
}


/**function that allows user to go to the previous employee once the previous button is pressed
on the modal window**/

function prevModal(btn, modals){
    btn.addEventListener('click', (e)=>{
        
        const selected_card = e.target.parentNode.parentNode;
        let index = [...modals].indexOf(selected_card);
       
        if(index == 0){
         modals[index].style.display = 'none';
         index = modals.length-1;
         modals[index].style.display = '';
          }else {
           index--; 
           modals[index].style.display = '';
           modals[index+1].style.display = 'none';
        }
    })
}
 












