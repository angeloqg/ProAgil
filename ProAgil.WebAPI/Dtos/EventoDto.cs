using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage="O local é deve ser preenchido!")]
        [StringLength(100,MinimumLength=3,ErrorMessage="Nome do local entre 3 e 100 caracteres")]
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage="O tema é deve ser preenchido!")]
        public string Tema { get; set; }

        [Range(2,120000,ErrorMessage="O evento deve ter entre e e 120 mil pessoas!")]
        public int QtdPessoas { get; set; }         
        public string ImagemUrl { get; set; }

        [Phone(ErrorMessage="Telefone no formato incorreto!")]
        public string Telefone { get; set; }

        [EmailAddress(ErrorMessage="E-mail no formato incorreto!")]
        public string Email { get; set; }

        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}