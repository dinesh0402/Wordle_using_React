import {useState} from "react";

const useWordle = (solution) => {

    const [turn , setTurn] = useState(0);
    const [currentGuess , setCurrentGuess] = useState('');
    const [guesses , setGuesses] = useState([...Array(6)]);
    const [history, setHistory] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [usedKeys, setUsedKeys] = useState({});
    

    // Formatting the guess using a array of letter objects.
    // like {key:'a',color:'yellow'}
    const formatGuess = () => {
        let solutionArray = [...solution];
        let formattedGuess = [...currentGuess].map((l) => {
            return ({key: l, color: 'grey'});
        });

        // find any green letters
        formattedGuess.forEach((l,i) => {
            if(solutionArray[i] === l.key){
                formattedGuess[i].color = 'green';
                solutionArray[i] = null;
            }
        });

        // find any yellow letters
        formattedGuess.forEach((l,i) => {
            if(solutionArray.includes(l.key) && l.color!='green'){
                formattedGuess[i].color = 'yellow';
                solutionArray[solutionArray.indexOf(l.key)] = null;
            }
        });

        return (formattedGuess);
    }

    //Adding new guess to guesses state and updating the isCorrect function accordingly.
    const addNewGuess = (formattedGuess) => {
        if(currentGuess === solution){
            setIsCorrect(true);
        }
        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses];
            newGuesses[turn] = formattedGuess;
            return (newGuesses);
        });
        setHistory((prevHistory) => {
            return [...prevHistory, currentGuess];
        });

        setTurn((prevTurn) => {
            return (prevTurn+1);
        });
        setUsedKeys((prevUsedKeys) => {
            let newKeys = {...prevUsedKeys};
            formattedGuess.forEach((l) => {
                const currentColor = newKeys[l.key];

                if(l.color === 'green'){
                    newKeys[l.key] = 'green';
                    return;
                }
                if(l.color === 'yellow' && currentColor != 'green'){
                    newKeys[l.key] = 'yellow';
                    return;
                }
                if(l.color === 'grey' && currentColor!='green' && currentColor!='yellow'){
                    newKeys[l.key] = 'grey';
                    return;
                }
            })

            return (newKeys);
        })
        setCurrentGuess('');
    }

    //Handle keyup event and track the current guess.
    const handleKeyUp = ({key}) => {
        if(key === 'Enter'){
            // only add guess if turn < 5
            if(turn > 5){
                console.log("You used all your guesses!");
                return;
            }

            // don't allow duplicate words
            if(history.includes(currentGuess)){
                console.log("You already tried that word!");
                return;
            }

             // check if word is 5 chars long
             if(currentGuess.length != 5){
                console.log("Word sholuld be 5 chars long!");
                return;
             }

            const formatted =  formatGuess();
            addNewGuess(formatted);
        }
        if(key === 'Backspace'){
            setCurrentGuess((prev)=>{
                return (prev.slice(0,-1));
            })
            return;
        }
        
        if(/^[A-Za-z]$/.test(key)){
            if(currentGuess.length < 5){
                setCurrentGuess((prev)=>{
                    return (prev + key);
                });
            }
        }
    } 

    return{turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyUp};
}

export default useWordle;