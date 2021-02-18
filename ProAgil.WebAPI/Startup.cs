using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using ProAgil.Domain.Identity;
using ProAgil.Repository;

namespace ProAgil.WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ProAgilContext>(
                x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection"))
                );
            

            // Ajustes das configurações de password do usuário
            IdentityBuilder builder = services.AddIdentityCore<User>( 
                
                opt => 
                {
                    opt.Password.RequireDigit = false;
                    opt.Password.RequireNonAlphanumeric = false;
                    opt.Password.RequireLowercase = false;
                    opt.Password.RequireUppercase = false;
                    opt.Password.RequiredLength = 4;
                }

            );

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<ProAgilContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();

            services.AddMvc( 
                opt =>{
                    var policy = new AuthorizationPolicyBuilder()
                                .RequireAuthenticatedUser()
                                .Build();
                    opt.Filters.Add(new AuthorizeFilter(policy));
                }
            ).SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
             .AddJsonOptions( opt => opt.SerializerSettings.ReferenceLoopHandling = 
             Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            // Injeção de Dependência: Repository => Repository
            services.AddScoped<IProAgilRepository, ProAgilRepository>();

            // Mapeamento de dados (AutoMapper)
            services.AddAutoMapper();


            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ProAgil WebAPI",
                    Version = "v1",
                    Description = "Api de gestão de eventos",
                    Contact = new OpenApiContact
                    {
                        Name = "Angelo Quintarelli Greenhalgh",
                        Email = "angeloqg@hotmail.com"
                    }
                });
            });

            // Implementação do uso CORS
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // Implementação das regras do CORS
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            
            // Permite carregar imagens a partir do diretório wwwroot (default), na api
            app.UseStaticFiles();
            // ==> Exemplo de acesso: http://localhost:5000/img/img1.jpg


            // Ajuste para carregar imagens a partir de um diretório específico na API 
            app.UseStaticFiles(new StaticFileOptions() {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(),@"Resources")),
                RequestPath = new PathString("/Resources")
            
            });
            // ==> Exemplo de acesso: http://localhost:5000/resources/img/img1.jpg

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProAgil WebAPI V1");
                c.RoutePrefix = String.Empty;
            });

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
