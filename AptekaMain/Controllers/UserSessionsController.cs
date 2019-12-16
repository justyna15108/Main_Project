using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AptekaMain.Models;
using Microsoft.AspNet.OData;
using System.Text;
using System.Security.Cryptography;

namespace AptekaMain.Controllers
{
    [EnableQuery]

    [Route("api/[controller]")]
    [ApiController]
    public class UserSessionsController : ControllerBase
    {
        private readonly AptekaMainContext _context;

        public UserSessionsController(AptekaMainContext context)
        {
            _context = context;
        }

        // GET: api/UserSessions
        [HttpGet]
        public IEnumerable<UserSession> GetUserSession()
        {
            return _context.UserSession;
        }

        // GET: api/UserSessions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserSession([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSession = await _context.UserSession.FindAsync(id);

            if (userSession == null)
            {
                return NotFound();
            }

            return Ok(userSession);
        }

        // PUT: api/UserSessions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSession([FromRoute] int id, [FromBody] UserSession userSession)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSession.IdSession)
            {
                return BadRequest();
            }

            _context.Entry(userSession).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSessionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        
        // POST: api/UserSessions
        [HttpPost]
        public async Task<IActionResult> PostUserSession([FromBody] User user_login)
        {
            var email = user_login.Email;
            var password = user_login.Password;
            var username = user_login.UserName;
            var user=await _context.Pracownik.SingleOrDefaultAsync(u => u.Email == email);
            var pass = await _context.Pass.SingleOrDefaultAsync(u => u.IdPracownika == user.IdPracownika);
            if(user == null)
            {
                return NotFound();
            }
            if (!VerifySha256Hash(password,pass.PassHash))
            {
                return BadRequest(new {errors="WrongPassword" });
            }
            // _context.UserSession.Add(userSession);
            await _context.SaveChangesAsync();

            UserSession us = new UserSession() { PracownikIdPracownika=user.IdPracownika,Access=user.PoziomDostepu,Active=true} ;
            _context.UserSession.Add(us);
            await _context.SaveChangesAsync();


            return CreatedAtAction("GetUserSession", new { id = us.IdSession }, us);
        }
        
        // DELETE: api/UserSessions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSession([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSession = await _context.UserSession.FindAsync(id);
            if (userSession == null)
            {
                return NotFound();
            }

            _context.UserSession.Remove(userSession);
            await _context.SaveChangesAsync();

            return Ok(userSession);
        }

        private bool UserSessionExists(int id)
        {
            return _context.UserSession.Any(e => e.IdSession == id);
        }

        private string GetSha256Hash(string rawData)
        {  
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private bool VerifySha256Hash(string input, string hash)
        {
            string hashOfInput = GetSha256Hash(input);

            StringComparer comparer = StringComparer.OrdinalIgnoreCase;

            if (0 == comparer.Compare(hashOfInput, hash))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}