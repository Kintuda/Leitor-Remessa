const process = async (cnab, banco, file, name) => {
    const layout = getLayout(cnab, banco)
    let json = {}
    json['fileName'] = name
    for (let field in layout) {
        let { segmento, posInicial, posFinal } = layout[field]
        let fieldSegment = file[segmento]
        if(!fieldSegment){
            continue
        }
        json[field] = fieldSegment.substring(posInicial - 1, posFinal)
        
    }
    return json
}

const getLayout = (cnab, banco) => {
    let layout = ''
    if (cnab !== 240){
        console.log('layout 400');
        layout = require(`../layout/${banco}.js`)
    }else{
        console.log('layout 240');
        layout = require(`../layout/240.js`)
    }
    return layout
}

module.exports = process