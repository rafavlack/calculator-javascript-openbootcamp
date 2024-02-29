import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const App = () => {

    const [display, setDisplay] = useState('0');
    const [input, setInput] = useState('0');
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [queue, setQueue] = useState([]);
    const [resetOnInput, setResetOnInput] = useState(false);

    const inputDigit = (digit) => {
        if (resetOnInput) {
            setDisplay(String(digit));
            setInput(String(digit));
            setQueue([]);
            setResetOnInput(false);
        } else if (waitingForOperand) {
            setDisplay(String(digit));
            setInput(input + String(digit));
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? String(digit) : display + digit);
            setInput(input === '0' ? String(digit) : input + digit);
        }
    }

    const inputDot = () => {
        if (waitingForOperand) {
            setDisplay('.');
            setInput(input + '.');
            setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
            setInput(input + '.');
        }
    }

    const clearDisplay = () => {
        setDisplay('0');
        setInput('0');
        setWaitingForOperand(false);
    }

    const performOperation = (nextOperator) => {
        // Agrega el número actual y el operador a la cola
        setQueue([...queue, parseFloat(display), nextOperator]);
        setInput(input + nextOperator);
        setDisplay(nextOperator);
        setWaitingForOperand(true);
    }

    const calculateResult = () => {
        let newQueue = [...queue, parseFloat(display)];

        // Realiza las operaciones de multiplicación y división primero
        newQueue = performOperations(newQueue, ['*', '/']);
        console.log('queuePerf*: '+queue)
        // Luego realiza las operaciones de suma y resta
        newQueue = performOperations(newQueue, ['+', '-']);

        // El resultado final es el primer elemento de la cola
        const result = newQueue[0];

        setDisplay(String(result.toFixed(3)));
        setInput('0');
        setQueue([]);
        setResetOnInput(true);
    }

    const performOperations = (queue, operators) => {
        let newQueue = [];
        let currentOperation = null;
        let skipNext = false;
        let finalQueue = [];

        // Primero, maneja el caso especial de la multiplicación por un número negativo
        for (let i = 0; i < queue.length; i++) {
            if (Number.isNaN(queue[i]) && queue[i - 1] === '*' && queue[i + 1] === '-') {
                let result = queue[i - 2] * -queue[i + 2];
                newQueue.push(result);
                i += 2;
                skipNext = true;
                finalQueue.push(result);
            } else if (Number.isNaN(queue[i])) {

                let prevNumber = queue[i - 2];
                let posNumber = queue[i + 2];
                let operador = queue[i + 1];
                let operation = prevNumber + ' ' + operador + ' ' + posNumber;
                let result = eval(operation);

                console.log('result: '+result);

                i += 2; // Salta los próximos dos elementos

                finalQueue.push(result);
            } else {
                newQueue.push(queue[i]);
            }
        }

        // Luego, realiza las operaciones matemáticas

        for (let element of newQueue) {
            const item = element;

            if (typeof item === 'number' && currentOperation !== null) {
                const previousNumber = finalQueue.pop();
                let result;
                if (currentOperation === '*' && !skipNext) {
                    result = previousNumber * item;
                } else if (currentOperation === '/') {
                    result = previousNumber / item;
                } else if (currentOperation === '+') {
                    result = previousNumber + item;
                } else if (currentOperation === '-') {
                    result = previousNumber - item;
                }

                finalQueue.push(result);
                currentOperation = null;
                skipNext = false; // Restablece skipNext después de cada operación
            } else if (typeof item === 'string' && operators.includes(item)) {
                currentOperation = item;
            } else {
                finalQueue.push(item);
            }
        }

        return finalQueue;
    };



    return (
        <div className="calculator">
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="bg-gray-200 rounded-lg shadow-md col-span-4">
                        <div className="text-right text-xl mx-5 text-danger font-serif italic bg-orange-300" id="user-input">{input}</div>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-lg shadow-md col-span-4">
                        <div className="text-right text-3xl font-bold" id="display">{display}</div>
                    </div>
                    <Button variant="danger" className="bg-red-500 text-white p-4 rounded-lg font-bold"  id="clear" onClick={clearDisplay}>AC</Button>
                    <Button variant="secondary" className="bg-gray-500 text-white p-4 rounded-lg font-bold" id="divide"  onClick={() => performOperation('/')}>/</Button>
                    <Button variant="secondary" className="bg-gray-500 text-white p-4 rounded-lg font-bold" id="multiply"  onClick={() => performOperation('*')}>*</Button>
                    <Button variant="secondary" className="bg-gray-500 text-white p-4 rounded-lg font-bold" id="subtract"  onClick={() => performOperation('-')}>-</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="seven" onClick={() => inputDigit(7)}>7</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="eight" onClick={() => inputDigit(8)}>8</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="nine" onClick={() => inputDigit(9)}>9</Button>
                    <Button variant="secondary" className="bg-gray-500 text-white p-4 rounded-lg font-bold" id="add"  onClick={() => performOperation('+')}>+</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="four" onClick={() => inputDigit(4)}>4</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="five" onClick={() => inputDigit(5)}>5</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="six" onClick={() => inputDigit(6)}>6</Button>
                    <Button variant="secondary" className="bg-blue-500 text-white p-4 rounded-lg font-bold" id="equals"  onClick={calculateResult}>=</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="one" onClick={() => inputDigit(1)}>1</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="two" onClick={() => inputDigit(2)}>2</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="three" onClick={() => inputDigit(3)}>3</Button>
                    <Button variant="dark" className="bg-gray-800 p-4 rounded-lg font-bold" id="zero" onClick={() => inputDigit(0)}>0</Button>
                    <Button variant="warning" className="bg-gray-500 p-4 rounded-lg font-bold" id="decimal" onClick={inputDot}>.</Button>
                </div>
            </div>
        </div>
    );
}

export default App;
