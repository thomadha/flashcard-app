/*import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

export const useEmptyFlashcardchecker = (frontText:string) =>{
    const navigateTo = useNavigate();
    const initCheck = 0
    const [text, nully] = useState('null')
    const setText = async (s : string) => {
        if( initCheck == 0){
        try {
          setText(frontText);
        } catch (error) {
          alert('Dette flashcardsettet er tomt');
          navigateTo('/home');
        }
        setText('null');
        }
        else{
            setText(s);
        }
    }
    return {text, setText};
}
*/
export default {}; 