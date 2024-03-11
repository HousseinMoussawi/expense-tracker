const symbol = document.getElementById('symbol')
const balance_currency = document.getElementById('balance-currency')
const balance_amount = document.getElementById('balance-amount')
const create = document.getElementById('create')
const create_amount = document.getElementById('create-amount')
const create_type = document.getElementById('create-type')
const create_currency = document.getElementById('create-currency')
const deleted = document.querySelectorAll('.delete')





let transaction = []
let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 0
balance_amount.innerHTML = balance


const converter = (from, to, amount) => {
    axios.post("https://crowded-cyan-wildebeest.cyclic.app/students/convert", {  
        "from": from,
        "to": to,
        "amount": amount
        
    })
    .then(response => {
        console.log(response.data)
    })
    
    }



const currencies = axios.get("https://rich-erin-angler-hem.cyclic.app/students/available")
    .then(response => {
        
        const addSymbol = () => {
            symbol.innerHTML = response.data.find(currency => currency.code === balance_currency.value).symbol
        }
        addSymbol()
        let from = balance_currency.value.toString()
        balance_currency.addEventListener('change', ()=>{
            console.log(from)
            converter(from,balance_currency.value.toString(),parseInt(balance_amount.innerHTML))
            from = balance_currency.value.toString()
            console.log(from)
            addSymbol()
            
        })
    }) 


const createTransaction = (amount, type, currency,id) => {
    localStorage.getItem('id') ? id = localStorage.getItem('id') : id = 0
    localStorage.getItem('transaction') ? transaction = JSON.parse(localStorage.getItem('transaction')) : transaction = []
    transaction.push({
        "id": id,
        "amount": amount,
        "type": type,
        "currency": currency
    })
    id++
    localStorage.setItem('id', id)
    localStorage.setItem('transaction', JSON.stringify(transaction))
    window.location.reload()
}

create.addEventListener('click', () => {
    if(create_amount.value === ''){ 
        alert('Please enter an amount')
        create_amount.value = ''
        return
    }
    else if(isNaN(create_amount.value) ){ 
        alert('Please enter a valid amount')
        create_amount.value = ''
        return
    }
    createTransaction(create_amount.value, create_type.value, create_currency.value)
    if(create_type.value === 'INCOME'){
        balance += parseInt(create_amount.value)
        localStorage.setItem('balance', balance)
        balance_amount.innerHTML = balance
    }
    else{
        balance -= parseInt(create_amount.value)
        localStorage.setItem('balance', balance)
        balance_amount.innerHTML = balance
    }
})



const getTransactions = () => {
    if(localStorage.getItem('transaction')){
        transaction = JSON.parse(localStorage.getItem('transaction'))
        for(let i = 0; i < transaction.length; i++){
            const tr = document.createElement('div')
            tr.classList.add('flex', 'border', 'space-evenly', 'txt-primary', 'transaction-card')
            tr.id = transaction[i].id
            tr.innerHTML = `<h3 class="type">${transaction[i].amount} </h3>
            <h3>${transaction[i].type}</h3>
            <h3>${transaction[i].currency}</h3>
            <h3>${transaction[i].id}</h3>
            <button class="bg-secondary update txt-primary border">update</button>
            <button class="delete bg-secondary  txt-primary border">delete</button>`
            document.getElementById('view-transactions').appendChild(tr)
    }
}}

getTransactions();


deleted.forEach(del => {
    del.addEventListener('click', () => {
        transaction = JSON.parse(localStorage.getItem('transaction'))
        const id = del.parentElement.id
        const transaction = JSON.parse(localStorage.getItem('transaction'))
        const index = transaction.findIndex(transaction => transaction.id === parseInt(id)) 
        if(transaction[index].type === 'INCOME'){
            balance -= parseInt(transaction[index].amount)
            localStorage.setItem('balance', balance)
            balance_amount.innerHTML = balance
        }
        else{
            balance += parseInt(transaction[index].amount)
            localStorage.setItem('balance', balance)
            balance_amount.innerHTML = balance
        }
        transaction.splice(index, 1)
        localStorage.setItem('transaction', JSON.stringify(transaction))
        window.location.reload()
    
})  })


