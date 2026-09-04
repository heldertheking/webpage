import {useState} from "react";


function randomDigit() {
    return 1 + Math.floor(Math.random() * 8)
}

export function useCaptcha() {
    const [a, setA] = useState(randomDigit)
    const [b, setB] = useState(randomDigit)
    const [answer, setAnswer] = useState('')

    function reroll() {
        setA(randomDigit())
        setB(randomDigit())
        setAnswer('')
    }

    const isCorrect = Number(answer) === a + b

    return {a, b, answer, setAnswer, isCorrect, reroll}
}