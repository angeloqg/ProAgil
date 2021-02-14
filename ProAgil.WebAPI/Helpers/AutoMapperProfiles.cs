using System.Linq;
using AutoMapper;
using ProAgil.Domain;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        // AutoMapper: Referenciando Domain ao DTO (Com mapeamento reverso)
        public AutoMapperProfiles()
        {
            // Mapeamento com ManyToMany
            CreateMap<Evento,EventoDto>()
                .ForMember(dest => dest.Palestrantes, opt =>{
                    opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Palestrante).ToList());
                }).ReverseMap();

            // Mapeamento com ManyToMany                
            CreateMap<Palestrante,PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt =>{
                    opt.MapFrom(src => src.EventosPalestrantes.Select(x => x.Evento).ToList());
                }).ReverseMap();
            
            CreateMap<Lote,LoteDto>().ReverseMap();
            CreateMap<RedeSocial,RedeSocialDto>().ReverseMap();                        
        }
    }
}