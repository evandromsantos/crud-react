import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3001/users' // URL base
const initialState = { // Estado inicial
    user: { name: '', email: '' },
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState } // Setando o estado inicial

    componentDidMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() { // Função para limpar o estado
        this.setState({ user: initialState.user })
    }

    save() { // Função para salvar e alterar usuário

        // Definindo usuário
        const user = this.state.user

        // put = alterar - post = incluir usuário
        const method = user.id ? 'put' : 'post'

        // Se contém ID irá pegar o URL base + o ID do usuário  
        // Se não irá pegar só o URL base sem do ID
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl

        // Chamando a função axios e passando o método que será chamado
        axios[method](url, user)
            .then(resp => {

                // list irá receber uma função que pega os dados que forem retornados pelo json server
                const list = this.getUpdatedList(resp.data)

                // Depois de alterar ou incluir um usuário
                // Chama o 'setState()' que irá alterar o usuário para o estado inicial 
                // E atualizar a lista que será retornada pela função 'getUpdatedList()'
                this.setState({ user: initialState.user, list })
            })
    }

    getUpdatedList(user, add = true) {
        // Gerando uma lista de usuário
        const list = this.state.list.filter(u => u.id !== user.id)

        // Adicionando o usuário na primeira posição da lista
        if (add) list.unshift(user)

        // Retornando a lista
        return list
    }

    updateField(event) {
        // Clonando o usuário e armazenando na constante 'user'
        const user = { ...this.state.user }

        // Setando o nome do input e pegando o valor que está no input
        user[event.target.name] = event.target.value

        // Chamando a função 'setState' e passando 'user' como parâmetro
        this.setState({ user })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="">Nome:</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>
                    <div className="col-12 col-ms-6">
                        <div className="form-group">
                            <label htmlFor="">E-mail:</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o e-mail..." />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ms-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ms-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}