package com.mycompany.fretes.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pagamento.
 */
@Entity
@Table(name = "pagamento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pagamento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "valor")
    private Double valor;

    @Column(name = "parcela")
    private Integer parcela;

    @Column(name = "forma_pagamento")
    private String formaPagamento;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cidade", "cliente", "motorista", "caminhao" }, allowSetters = true)
    private Frete frete;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pagamento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getValor() {
        return this.valor;
    }

    public Pagamento valor(Double valor) {
        this.setValor(valor);
        return this;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Integer getParcela() {
        return this.parcela;
    }

    public Pagamento parcela(Integer parcela) {
        this.setParcela(parcela);
        return this;
    }

    public void setParcela(Integer parcela) {
        this.parcela = parcela;
    }

    public String getFormaPagamento() {
        return this.formaPagamento;
    }

    public Pagamento formaPagamento(String formaPagamento) {
        this.setFormaPagamento(formaPagamento);
        return this;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public Frete getFrete() {
        return this.frete;
    }

    public void setFrete(Frete frete) {
        this.frete = frete;
    }

    public Pagamento frete(Frete frete) {
        this.setFrete(frete);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pagamento)) {
            return false;
        }
        return id != null && id.equals(((Pagamento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pagamento{" +
            "id=" + getId() +
            ", valor=" + getValor() +
            ", parcela=" + getParcela() +
            ", formaPagamento='" + getFormaPagamento() + "'" +
            "}";
    }
}
