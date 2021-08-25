function AllData(){
    const [data, setData] = React.useState('');    

    React.useEffect(() => {
        
        // fetch all accounts from API
        fetch('/account/all',
        { method: 'GET',
      headers: {
        'Authorization': window.sessionStorage.getItem('tokenGoodBank'),
        'Content-Type': 'application/json'
      }
    }
        )
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(JSON.stringify(data));                
            });

    }, []);

    return (<>
        <h5>All Data in Store:</h5>
        {data}
    </>);
}
