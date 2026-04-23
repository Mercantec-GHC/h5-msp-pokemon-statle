using Microsoft.AspNetCore.Authentication;

using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.AspNetCore.OpenApi;

using Microsoft.OpenApi;

  

namespace API.Models

{

};

  

/// <summary>

/// Tilføjer JWT Bearer ("Authorize") til OpenAPI-dokumentet, så Swagger UI/Scalar

/// kan sende <c>Authorization: Bearer &lt;token&gt;</c>.

///

/// Bemærk: Dette ændrer kun dokumentationen – ikke jeres runtime-sikkerhed.

/// Runtime-sikkerheden styres af <c>AddAuthentication().AddJwtBearer()</c> + <c>app.UseAuthentication()</c>.

/// </summary>

internal sealed class BearerSecuritySchemeTransformer : IOpenApiDocumentTransformer

{

    private readonly IAuthenticationSchemeProvider _authenticationSchemeProvider;

  

    public BearerSecuritySchemeTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider)

    {

        _authenticationSchemeProvider = authenticationSchemeProvider;

    }

  

    public async Task TransformAsync(

        OpenApiDocument document,

        OpenApiDocumentTransformerContext context,

        CancellationToken cancellationToken)

    {

        var schemes = await _authenticationSchemeProvider.GetAllSchemesAsync();

  

        // Hvis der ikke findes en bearer-scheme i app'en, skal vi ikke injecte noget i OpenAPI.

        var hasBearer = schemes.Any(s =>

            string.Equals(s.Name, JwtBearerDefaults.AuthenticationScheme, StringComparison.OrdinalIgnoreCase) ||

            string.Equals(s.Name, "Bearer", StringComparison.OrdinalIgnoreCase));

  

        if (!hasBearer)

        {

            return;

        }

  

        document.Components ??= new OpenApiComponents();

        document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();

  

        // Definér "Bearer" scheme (så UI kan vise "Authorize" knap).

        document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme

        {

            Type = SecuritySchemeType.Http,

            Scheme = "bearer",

            In = ParameterLocation.Header,

            BearerFormat = "JWT",

            Description =

                "JWT Authorization header using the Bearer scheme.\n\n" +

                "Indtast: 'Bearer' [mellemrum] og derefter din token.\n" +

                "Eksempel: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

        };

  

        // Gør Bearer til et krav på alle operationer i dokumentet.

        foreach (var operation in document.Paths.Values.SelectMany(p => p.Operations).Select(o => o.Value))

        {

            operation.Security ??= new List<OpenApiSecurityRequirement>();

            operation.Security.Add(new OpenApiSecurityRequirement

            {

                [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()

            });

        }

    }

}