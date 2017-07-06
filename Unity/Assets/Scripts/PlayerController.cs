using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerController : MonoBehaviour
{

    public float speed;
    public int pNum;

    private Rigidbody rb;

    private int score;
    public Text scoreText;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        scoreText.text = "Score: 0";
        score = 0;
    }

    void FixedUpdate()
    {
        float moveHorizontal = Input.GetAxis("Horizontal" + pNum);
        float moveVertical = Input.GetAxis("Vertical" + pNum);

        Vector3 movement = new Vector3(moveHorizontal, 0.0f, moveVertical);

        rb.AddForce(movement * speed);
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.CompareTag("Pikcup"))
        {
            other.gameObject.SetActive(false);
            addScore();
        }
    }

    private void addScore()
    {
        score++;
        scoreText.text = "Score: " + score.ToString();
    }
}
