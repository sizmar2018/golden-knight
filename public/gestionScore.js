
function updateScore(score,scoreText,gravite) {
    score += 10;
    scoreText.setText('Score : ' + score);
       
    return score;

}


export {
    updateScore
}