function ThemeScreen({ themeSelected }) {
    return (
        <section id="themeScreen">
            <h1>Selection du thème en cours de manière aléatoire</h1>
            {themeSelected && (
                <h2>Thème sélectionné : {themeSelected}</h2>
            )}
        </section>
    );
}
export default ThemeScreen;
