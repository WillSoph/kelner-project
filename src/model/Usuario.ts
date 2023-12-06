export default interface Usuario {
    uid: string
    email: string
    nome: string
    token: string
    provedor: string
    imagemUrl: string
    stripe_customer_id: string
}