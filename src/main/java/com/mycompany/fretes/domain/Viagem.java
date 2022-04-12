package com.mycompany.fretes.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Viagem.
 */
@Entity
@Table(name = "viagem")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Viagem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "valor_despesa", nullable = false)
    private Double valorDespesa;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cidade", "cliente", "motorista", "caminhao" }, allowSetters = true)
    private Frete frete;

    @ManyToOne
    private Despesa dispesa;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Viagem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getValorDespesa() {
        return this.valorDespesa;
    }

    public Viagem valorDespesa(Double valorDespesa) {
        this.setValorDespesa(valorDespesa);
        return this;
    }

    public void setValorDespesa(Double valorDespesa) {
        this.valorDespesa = valorDespesa;
    }

    public Frete getFrete() {
        return this.frete;
    }

    public void setFrete(Frete frete) {
        this.frete = frete;
    }

    public Viagem frete(Frete frete) {
        this.setFrete(frete);
        return this;
    }

    public Despesa getDispesa() {
        return this.dispesa;
    }

    public void setDispesa(Despesa despesa) {
        this.dispesa = despesa;
    }

    public Viagem dispesa(Despesa despesa) {
        this.setDispesa(despesa);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Viagem)) {
            return false;
        }
        return id != null && id.equals(((Viagem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Viagem{" +
            "id=" + getId() +
            ", valorDespesa=" + getValorDespesa() +
            "}";
    }
}
