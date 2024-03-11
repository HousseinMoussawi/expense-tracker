const symbol = document.getElementById('symbol')
const balance_currency = document.getElementById('balance-currency')
const balance_amount = document.getElementById('balance-amount')
const create = document.getElementById('create')
const create_amount = document.getElementById('create-amount')
const create_type = document.getElementById('create-type')
const create_currency = document.getElementById('create-currency')
const deleted = document.querySelectorAll('.delete')
const filter_by_income = document.getElementById('filter-by-income')
const filter_by_expense = document.getElementById('filter-by-expense')
const from = document.getElementById('from')
const to = document.getElementById('to')
const filter_by_currency = document.getElementById('filter-by-currency')




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
            <h3 class="${transaction[i].type}">${transaction[i].type}</h3>
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
        const id = del.parentElement.id
        let transaction = JSON.parse(localStorage.getItem('transaction'))
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

filter_by_income.addEventListener('click', () => {
    const transaction = JSON.parse(localStorage.getItem('transaction'))
    const income = transaction.filter(transaction => transaction.type === 'INCOME')
    document.getElementById('view-transactions').innerHTML = `<div class="flex center border filter bg-primary">
    <h2>FILTER:</h2>
    <ul class="flex filter-by center">
        <li><h3 class="txt-primary" id="filter-by-income">INCOME</h3></li>
        <li><h3 class="txt-primary" id="filter-by-expense">EXPENSE</h3></li>
        <li><input type="text" class="bg-secondary border txt-secondary bold" placeholder="from" id="from"></li>
        <li><input type="text" class="bg-secondary border txt-secondary bold" placeholder="to" id="to"></li>
        <li>
            <select name="" id="filter-by-currency" class="bg-primary txt-primary border">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="LBP">LBP</option>
                <option value="AED">AED</option>
            </select></li>
    </ul>
</div>`
    for(let i = 0; i < income.length; i++){
        const tr = document.createElement('div')
        tr.classList.add('flex', 'border', 'space-evenly', 'txt-primary', 'transaction-card')
        tr.id = income[i].id
        tr.innerHTML = `<h3 class="type">${income[i].amount} </h3>
        <h3 class="${income[i].type}">${income[i].type}</h3>
        <h3>${income[i].currency}</h3>
        <h3>${income[i].id}</h3>
        <button class="bg-secondary update txt-primary border">update</button>
        <button class="delete bg-secondary  txt-primary border">delete</button>`
        document.getElementById('view-transactions').appendChild(tr)
    }
}   )

filter_by_expense.addEventListener('click', () => { 

    const transaction = JSON.parse(localStorage.getItem('transaction'))
    const expense = transaction.filter(transaction => transaction.type === 'EXPENSE')
    document.getElementById('view-transactions').innerHTML = `<div class="flex center border filter bg-primary">
    <h2>FILTER:</h2>
    <ul class="flex filter-by center">
        <li><h3 class="txt-primary" id="filter-by-income">INCOME</h3></li>
        <li><h3 class="txt-primary" id="filter-by-expense">EXPENSE</h3></li>
        <li><input type="text" class="bg-secondary border txt-secondary bold" placeholder="from" id="from"></li>
        <li><input type="text" class="bg-secondary border txt-secondary bold" placeholder="to" id="to"></li>
        <li>
            <select name="" id="filter-by-currency" class="bg-primary txt-primary border">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="LBP">LBP</option>
                <option value="AED">AED</option>
            </select></li>
    </ul>
    </div>`
    for(let i = 0; i < expense.length; i++){
        console.log('hello')
        const tr = document.createElement('div')
        tr.classList.add('flex', 'border', 'space-evenly', 'txt-primary', 'transaction-card')
        tr.id = expense[i].id
        tr.innerHTML = `<h3 class="type">${expense[i].amount} </h3>
        <h3 class="${expense[i].type}">${expense[i].type}</h3>
        <h3>${expense[i].currency}</h3>
        <h3>${expense[i].id}</h3>
        <button class="bg-secondary update txt-primary border">update</button>
        <button class="delete bg-secondary  txt-primary border">delete</button>`
        document.getElementById('view-transactions').appendChild(tr)
    }
}   )

