


export default class {
    /****
     * @param {HTML TableElement} root the table element which will display the CSV data.
     * 
     * 
     */

    constructor(root) {
        this.root = root;
    }

    update(data, headerColumns = []){
        this.clear;
        this.setHeader(headerColumns);
        this.setBody(data);
    }

    // clears table
    clear(){
        this.root.innerHTML ="";
    }

    //list of headings to be used
    setHeader(headerColumns) {
        this.root.insertAdjacentHTML("afterbegin", `
            <thead>
                <tr>
                    ${headerColumns.map(text => `<th>${text}</th>`).join("")}
                </tr>
            </thead>
            
            `);
    }
    setBody(data){
        const rowsHtml = data.map(row =>{
            return `
                <tr>
                    ${row.map(text => `<td>${text}</td>`).join("")}
                </tr>
                  `;
        })
       this.root.insertAdjacentHTML("beforeend", `
            <tbody>
             ${rowsHtml.join("")}
            </tbody>
             `);
    }
    

}