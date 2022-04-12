package com.mycompany.fretes.domain;

import com.mycompany.fretes.domain.enumeration.Sexo;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Motorista.
 */
@Entity
@Table(name = "motorista")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Motorista implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "telefone_adicional")
    private String telefoneAdicional;

    @Column(name = "cnh")
    private String cnh;

    @Enumerated(EnumType.STRING)
    @Column(name = "sexo")
    private Sexo sexo;

    @OneToOne
    @JoinColumn(unique = true)
    private Endereco endereco;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Motorista id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Motorista nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return this.telefone;
    }

    public Motorista telefone(String telefone) {
        this.setTelefone(telefone);
        return this;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getTelefoneAdicional() {
        return this.telefoneAdicional;
    }

    public Motorista telefoneAdicional(String telefoneAdicional) {
        this.setTelefoneAdicional(telefoneAdicional);
        return this;
    }

    public void setTelefoneAdicional(String telefoneAdicional) {
        this.telefoneAdicional = telefoneAdicional;
    }

    public String getCnh() {
        return this.cnh;
    }

    public Motorista cnh(String cnh) {
        this.setCnh(cnh);
        return this;
    }

    public void setCnh(String cnh) {
        this.cnh = cnh;
    }

    public Sexo getSexo() {
        return this.sexo;
    }

    public Motorista sexo(Sexo sexo) {
        this.setSexo(sexo);
        return this;
    }

    public void setSexo(Sexo sexo) {
        this.sexo = sexo;
    }

    public Endereco getEndereco() {
        return this.endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public Motorista endereco(Endereco endereco) {
        this.setEndereco(endereco);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Motorista)) {
            return false;
        }
        return id != null && id.equals(((Motorista) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Motorista{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", telefone='" + getTelefone() + "'" +
            ", telefoneAdicional='" + getTelefoneAdicional() + "'" +
            ", cnh='" + getCnh() + "'" +
            ", sexo='" + getSexo() + "'" +
            "}";
    }
}
