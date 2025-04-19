// This is the script that consoles and GUIs can access

const pix = {
    enums: {
        brush: {
            pencil: "pencil"
        }
    },
    tools: {
        currentBrush: "pencil",
        changeBrush: (type) => { print("change brush") }
    },
}